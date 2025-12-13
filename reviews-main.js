// Main Reviews JavaScript
let selectedRating = 0;

// Initialize reviews system
function initializeReviews() {
  setupStarRating();
  displayReviews();
  updateSummary();
  setupSortControls();
  setupReviewForm();
}

// Setup interactive star rating
function setupStarRating() {
  const stars = document.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      document.getElementById('ratingValue').value = selectedRating;
      updateStarDisplay(selectedRating);
    });
    
    star.addEventListener('mouseover', () => {
      updateStarDisplay(index + 1);
    });
  });
  
  document.getElementById('starRating').addEventListener('mouseleave', () => {
    updateStarDisplay(selectedRating);
  });
}

// Update star display
function updateStarDisplay(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
}

// Generate star display HTML
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}

// Display approved reviews
function displayReviews(sortBy = 'latest') {
  const container = document.getElementById('reviewsList');
  if (!container) return;
  
  const reviews = reviewsSystem.sortReviews(sortBy);
  
  if (reviews.length === 0) {
    container.innerHTML = '<p style=\"text-align: center; color: #666;\">No reviews yet. Be the first to review!</p>';
    return;
  }
  
  container.innerHTML = reviews.map(review => `
    <div class=\"review-item\">\n      <div class=\"review-header\">\n        <div class=\"reviewer-info\">\n          <span class=\"reviewer-name\">${review.name}</span>\n          <span class=\"review-rating\">${generateStars(review.rating)}</span>\n        </div>\n        <span class=\"review-date\">${review.date}</span>\n      </div>\n      <div class=\"review-comment\">${review.comment}</div>\n    </div>\n  `).join('');
}

// Update reviews summary
function updateSummary() {
  const avgRating = reviewsSystem.getAverageRating();
  const totalReviews = reviewsSystem.getTotalCount();
  
  document.getElementById('avgRating').textContent = avgRating;
  document.getElementById('totalReviews').textContent = totalReviews;
  document.getElementById('avgStars').innerHTML = generateStars(Math.round(avgRating));
}

// Setup sort controls
function setupSortControls() {
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      displayReviews(e.target.value);
    });
  }
}

// Setup review form
function setupReviewForm() {
  const form = document.getElementById('reviewForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitReview();
    });
  }
}

// Submit new review
function submitReview() {
  const name = document.getElementById('reviewerName').value.trim();
  const rating = document.getElementById('ratingValue').value;
  const comment = document.getElementById('reviewComment').value.trim();
  
  if (!rating) {
    alert('Please select a rating');
    return;
  }
  
  if (!comment) {
    alert('Please write a comment');
    return;
  }
  
  // Add review
  reviewsSystem.addReview(name, rating, comment);
  
  // Clear form
  document.getElementById('reviewForm').reset();
  selectedRating = 0;
  updateStarDisplay(0);
  
  // Show confirmation
  showConfirmation('Review submitted! It will appear after admin approval.');
}

// Show confirmation message
function showConfirmation(message) {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  popup.textContent = message;
  
  document.body.appendChild(popup);
  
  setTimeout(() => {
    popup.remove();
  }, 3000);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initializeReviews);