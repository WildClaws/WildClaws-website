// Booking System JavaScript

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Handle form submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const booking = {
            id: generateBookingId(),
            customerName: document.getElementById('customerName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            notes: document.getElementById('notes').value,
            timestamp: new Date().toISOString()
        };
        
        // Validate booking
        if (!validateBooking(booking)) {
            return;
        }
        
        // Save booking to local storage
        saveBooking(booking);
        
        // Show confirmation message
        showConfirmation();
        
        // Reset form
        bookingForm.reset();
    });
}

// Generate unique booking ID
function generateBookingId() {
    return 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Validate booking
function validateBooking(booking) {
    // Check if slot is already booked
    const bookings = getBookings();
    const slotTaken = bookings.some(b => 
        b.date === booking.date && b.time === booking.time
    );
    
    if (slotTaken) {
        alert('Sorry, this time slot is already booked. Please choose another time.');
        return false;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Please select a future date.');
        return false;
    }
    
    return true;
}

// Save booking to local storage
function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('wildClawsBookings', JSON.stringify(bookings));
}

// Get all bookings from local storage
function getBookings() {
    const bookings = localStorage.getItem('wildClawsBookings');
    return bookings ? JSON.parse(bookings) : [];
}

// Show confirmation message
function showConfirmation() {
    const confirmationMessage = document.getElementById('confirmationMessage');
    if (confirmationMessage) {
        confirmationMessage.style.display = 'block';
        
        // Scroll to confirmation
        confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide after 5 seconds
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 5000);
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Get service name
function getServiceName(serviceCode) {
    const services = {
        'acrylic': 'Acrylic Extensions',
        'gel': 'Gel Extensions',
        'fiberglass': 'Fiberglass Extensions',
        'silk': 'Silk Wrap Extensions'
    };
    return services[serviceCode] || serviceCode;
}
