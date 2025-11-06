// Admin Dashboard JavaScript

let allBookings = [];

// Load bookings on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupFilters();
});

// Load dashboard data
function loadDashboard() {
    allBookings = getBookings();
    updateStats();
    displayBookings(allBookings);
}

// Update statistics
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = allBookings.filter(b => b.date === today);
    
    const now = new Date();
    const upcomingBookings = allBookings.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate >= now;
    });

    document.getElementById('totalBookings').textContent = allBookings.length;
    document.getElementById('todayBookings').textContent = todayBookings.length;
    document.getElementById('upcomingBookings').textContent = upcomingBookings.length;
}

// Display bookings
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<div class="no-bookings"><p>No bookings found.</p></div>';
        return;
    }
    
    // Sort bookings by date and time (most recent first)
    const sortedBookings = bookings.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
    });
    
    bookingsList.innerHTML = sortedBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div>
                    <h3>${booking.customerName}</h3>
                    <span class="booking-id">${booking.id}</span>
                </div>
            </div>
            
            <div class="booking-details">
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${booking.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">${booking.phone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Service</span>
                    <span class="detail-value">${getServiceName(booking.service)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">${formatDate(booking.date)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Time</span>
                    <span class="detail-value">${formatTime(booking.time)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Booked On</span>
                    <span class="detail-value">${new Date(booking.timestamp).toLocaleDateString()}</span>
                </div>
            </div>
            
            ${booking.notes ? `
                <div class="detail-item" style="margin-top: 1rem;">
                    <span class="detail-label">Notes</span>
                    <span class="detail-value">${booking.notes}</span>
                </div>
            ` : ''}
            
            <div class="booking-actions">
                <button class="btn-delete" onclick="deleteBooking('${booking.id}')">Delete Booking</button>
            </div>
        </div>
    `).join('');
}

// Setup filters
function setupFilters() {
    document.getElementById('filterDate').addEventListener('change', applyFilters);
    document.getElementById('filterService').addEventListener('change', applyFilters);
    document.getElementById('searchCustomer').addEventListener('input', applyFilters);
}

// Apply filters
function applyFilters() {
    const filterDate = document.getElementById('filterDate').value;
    const filterService = document.getElementById('filterService').value;
    const searchCustomer = document.getElementById('searchCustomer').value.toLowerCase();
    
    let filtered = allBookings;
    
    if (filterDate) {
        filtered = filtered.filter(b => b.date === filterDate);
    }
    
    if (filterService) {
        filtered = filtered.filter(b => b.service === filterService);
    }
    
    if (searchCustomer) {
        filtered = filtered.filter(b => 
            b.customerName.toLowerCase().includes(searchCustomer) ||
            b.email.toLowerCase().includes(searchCustomer)
        );
    }
    
    displayBookings(filtered);
}

// Delete booking
function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        const bookings = getBookings();
        const updatedBookings = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem('wildClawsBookings', JSON.stringify(updatedBookings));
        
        // Reload dashboard
        loadDashboard();
    }
}

// Export bookings (optional feature)
function exportBookings() {
    const bookings = getBookings();
    const dataStr = JSON.stringify(bookings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wildclaws-bookings.json';
    link.click();
}
