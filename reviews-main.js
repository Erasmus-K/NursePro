// Main Reviews JavaScript with Enhanced Features
let selectedRating = 0;
let currentPage = 1;
const reviewsPerPage = 5;

// Initialize reviews system
function initializeReviews() {
  setupStarRating();
  displayReviews();
  updateSummary();
  setupSortControls();
  setupReviewForm();
  setupSearchFunctionality();
  displayRatingDistribution();
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

// Display approved reviews with pagination
function displayReviews(sortBy = 'latest', searchQuery = '') {
  const container = document.getElementById('reviewsList');
  if (!container) return;
  
  let reviews;
  if (searchQuery) {
    reviews = reviewsSystem.searchReviews(searchQuery);
  } else {
    reviews = reviewsSystem.sortReviews(sortBy);
  }
  
  // Pagination
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = reviews.slice(startIndex, endIndex);
  
  if (reviews.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No reviews found. Be the first to review!</p>';
    return;
  }
  
  container.innerHTML = `
    <div class="reviews-header">
      <h4>Showing ${startIndex + 1}-${Math.min(endIndex, reviews.length)} of ${reviews.length} reviews</h4>
    </div>
    ${paginatedReviews.map(review => `
      <div class="review-item" data-review-id="${review.id}">
        <div class="review-header">
          <div class="reviewer-info">
            <span class="reviewer-name">${review.name}</span>
            <span class="review-rating">${generateStars(review.rating)}</span>
          </div>
          <span class="review-date">${formatDate(review.date)}</span>
        </div>
        <div class="review-comment">${review.comment}</div>
        <div class="review-actions">
          <button class="helpful-btn" onclick="markReviewHelpful(${review.id})" title="Mark as helpful">
            <i class="fas fa-thumbs-up"></i> Helpful (${review.helpful || 0})
          </button>
          <button class="share-btn" onclick="shareReview(${review.id})" title="Share this review">
            <i class="fas fa-share"></i> Share
          </button>
        </div>
      </div>
    `).join('')}
    ${createPaginationControls(reviews.length)}
  `;
}

// Create pagination controls
function createPaginationControls(totalReviews) {
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  if (totalPages <= 1) return '';
  
  let pagination = '<div class="pagination">';
  
  // Previous button
  if (currentPage > 1) {
    pagination += `<button onclick="changePage(${currentPage - 1})" class="page-btn">← Previous</button>`;
  }
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      pagination += `<button class="page-btn active">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pagination += `<button onclick="changePage(${i})" class="page-btn">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pagination += '<span class="page-dots">...</span>';
    }
  }
  
  // Next button
  if (currentPage < totalPages) {
    pagination += `<button onclick="changePage(${currentPage + 1})" class="page-btn">Next →</button>`;
  }
  
  pagination += '</div>';
  return pagination;
}

// Change page
function changePage(page) {
  currentPage = page;
  displayReviews(document.getElementById('sortSelect')?.value || 'latest');
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Mark review as helpful
function markReviewHelpful(reviewId) {
  const helpfulCount = reviewsSystem.markHelpful(reviewId);
  const btn = document.querySelector(`[data-review-id="${reviewId}"] .helpful-btn`);
  if (btn) {
    btn.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${helpfulCount})`;
    btn.disabled = true;
    btn.style.opacity = '0.6';
    showNotification('Thank you for your feedback!', 'success');
  }
}

// Share review
function shareReview(reviewId) {
  const review = reviewsSystem.reviews.find(r => r.id === reviewId);
  if (!review) return;
  
  const shareText = `Check out this review for NurseWrite Pro: "${review.comment.substring(0, 100)}..." - ${review.name} (${review.rating}/5 stars)`;
  const shareUrl = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: 'NurseWrite Pro Review',
      text: shareText,
      url: shareUrl
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
      showNotification('Review link copied to clipboard!', 'success');
    });
  }
}

// Display rating distribution
function displayRatingDistribution() {
  const distribution = reviewsSystem.getRatingDistribution();
  const total = reviewsSystem.getTotalCount();
  
  const distributionHtml = Object.keys(distribution)
    .sort((a, b) => b - a)
    .map(rating => {
      const count = distribution[rating];
      const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
      
      return `
        <div class="rating-bar" onclick="filterByRating(${rating})">
          <span class="rating-label">${rating} ★</span>
          <div class="rating-progress">
            <div class="rating-fill" style="width: ${percentage}%"></div>
          </div>
          <span class="rating-count">${count}</span>
        </div>
      `;
    }).join('');
  
  // Add to reviews summary if container exists
  const summaryContainer = document.querySelector('.reviews-summary');
  if (summaryContainer && !document.querySelector('.rating-distribution')) {
    const distributionContainer = document.createElement('div');
    distributionContainer.className = 'rating-distribution';
    distributionContainer.innerHTML = `
      <h4>Rating Breakdown</h4>
      ${distributionHtml}
    `;
    summaryContainer.appendChild(distributionContainer);
  }
}

// Filter reviews by rating
function filterByRating(rating) {
  const reviews = reviewsSystem.getReviewsByRating(parseInt(rating));
  const container = document.getElementById('reviewsList');
  
  if (reviews.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #666; padding: 40px;">No ${rating}-star reviews found.</p>`;
    return;
  }
  
  container.innerHTML = `
    <div class="reviews-header">
      <h4>${rating}-Star Reviews (${reviews.length})</h4>
      <button onclick="displayReviews()" class="clear-filter-btn">Show All Reviews</button>
    </div>
    ${reviews.map(review => `
      <div class="review-item" data-review-id="${review.id}">
        <div class="review-header">
          <div class="reviewer-info">
            <span class="reviewer-name">${review.name}</span>
            <span class="review-rating">${generateStars(review.rating)}</span>
          </div>
          <span class="review-date">${formatDate(review.date)}</span>
        </div>
        <div class="review-comment">${review.comment}</div>
        <div class="review-actions">
          <button class="helpful-btn" onclick="markReviewHelpful(${review.id})">
            <i class="fas fa-thumbs-up"></i> Helpful (${review.helpful || 0})
          </button>
        </div>
      </div>
    `).join('')}
  `;
}

// Setup search functionality
function setupSearchFunctionality() {
  // Add search box to reviews section
  const reviewsSection = document.querySelector('.reviews-display');
  if (reviewsSection && !document.querySelector('.reviews-search')) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'reviews-search';
    searchContainer.innerHTML = `
      <div class="search-box">
        <input type="text" id="reviewsSearchInput" placeholder="Search reviews..." />
        <button onclick="searchReviews()" class="search-btn">
          <i class="fas fa-search"></i>
        </button>
        <button onclick="clearSearch()" class="clear-search-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    reviewsSection.insertBefore(searchContainer, reviewsSection.firstChild);
    
    // Add real-time search
    document.getElementById('reviewsSearchInput').addEventListener('input', debounce(searchReviews, 300));
  }
}

// Search reviews
function searchReviews() {
  const query = document.getElementById('reviewsSearchInput')?.value || '';
  currentPage = 1; // Reset to first page
  displayReviews('latest', query);
}

// Clear search
function clearSearch() {
  const searchInput = document.getElementById('reviewsSearchInput');
  if (searchInput) {
    searchInput.value = '';
    searchReviews();
  }
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Update reviews summary with enhanced stats
function updateSummary() {
  const avgRating = reviewsSystem.getAverageRating();
  const totalReviews = reviewsSystem.getTotalCount();
  
  document.getElementById('avgRating').textContent = avgRating;
  document.getElementById('totalReviews').textContent = totalReviews;
  document.getElementById('avgStars').innerHTML = generateStars(Math.round(avgRating));
  
  // Update rating distribution
  displayRatingDistribution();
}

// Setup sort controls with more options
function setupSortControls() {
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    // Add more sort options
    sortSelect.innerHTML = `
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
      <option value="highest">Highest Rating</option>
      <option value="lowest">Lowest Rating</option>
      <option value="helpful">Most Helpful</option>
    `;
    
    sortSelect.addEventListener('change', (e) => {
      currentPage = 1; // Reset to first page
      displayReviews(e.target.value);
    });
  }
}

// Setup review form with enhanced validation
function setupReviewForm() {
  const form = document.getElementById('reviewForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitReview();
    });
    
    // Add character counter for comment
    const commentField = document.getElementById('reviewComment');
    if (commentField) {
      const counter = document.createElement('div');
      counter.className = 'character-counter';
      counter.innerHTML = '<span id="charCount">0</span>/500 characters';
      commentField.parentNode.insertBefore(counter, commentField.nextSibling);
      
      commentField.addEventListener('input', () => {
        const count = commentField.value.length;
        document.getElementById('charCount').textContent = count;
        counter.style.color = count > 450 ? '#dc3545' : '#666';
      });
    }
  }
}

// Submit new review with enhanced validation
function submitReview() {
  const name = document.getElementById('reviewerName').value.trim();
  const rating = document.getElementById('ratingValue').value;
  const comment = document.getElementById('reviewComment').value.trim();
  
  try {
    // Add review with validation
    reviewsSystem.addReview(name, rating, comment);
    
    // Clear form
    document.getElementById('reviewForm').reset();
    selectedRating = 0;
    updateStarDisplay(0);
    
    // Reset character counter
    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = '0';
    
    // Show success message
    showNotification('Review submitted successfully! It will appear after admin approval.', 'success');
    
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initializeReviews);