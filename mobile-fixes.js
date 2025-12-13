// ESSENTIAL JAVASCRIPT MOBILE FIXES

// 1. Prevent horizontal scroll
function preventHorizontalScroll() {
  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowX = 'hidden';
}

// 2. Fix viewport on mobile
function fixMobileViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
}

// 3. Touch-friendly star rating
function setupMobileStarRating() {
  const stars = document.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    // Touch events for mobile
    star.addEventListener('touchstart', (e) => {
      e.preventDefault();
      setRating(index + 1);
    });
    
    // Click events for desktop
    star.addEventListener('click', (e) => {
      e.preventDefault();
      setRating(index + 1);
    });
  });
}

function setRating(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
  
  // Update hidden input if exists
  const ratingInput = document.getElementById('ratingValue');
  if (ratingInput) {
    ratingInput.value = rating;
  }
}

// 4. Resize handler for responsive adjustments
function handleResize() {
  const width = window.innerWidth;
  
  // Adjust elements based on screen size
  if (width <= 480) {
    // Small mobile adjustments
    document.querySelectorAll('.review-item, .question-item').forEach(item => {
      item.style.padding = '15px';
    });
  } else if (width <= 768) {
    // Tablet adjustments
    document.querySelectorAll('.review-item, .question-item').forEach(item => {
      item.style.padding = '20px';
    });
  }
}

// 5. Form validation with mobile considerations
function validateMobileForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#dc3545';
        isValid = false;
        
        // Mobile-friendly error message
        showMobileAlert('Please fill in all required fields');
      } else {
        input.style.borderColor = '#28a745';
      }
    });
    
    if (isValid) {
      // Process form submission
      showMobileAlert('Form submitted successfully!');
    }
  });
}

// 6. Mobile-friendly alert
function showMobileAlert(message) {
  // Create mobile-friendly notification
  const alert = document.createElement('div');
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #007bff;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 9999;
    max-width: 90%;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  // Remove after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// 7. Initialize all mobile fixes
function initMobileFixes() {
  preventHorizontalScroll();
  fixMobileViewport();
  setupMobileStarRating();
  
  // Add resize listener
  window.addEventListener('resize', handleResize);
  
  // Initial resize call
  handleResize();
  
  // Setup form validation
  validateMobileForm('reviewForm');
  validateMobileForm('questionForm');
}

// 8. Run fixes when DOM is loaded
document.addEventListener('DOMContentLoaded', initMobileFixes);

// 9. Additional touch improvements
document.addEventListener('touchstart', function() {}, {passive: true});
document.addEventListener('touchmove', function() {}, {passive: true});