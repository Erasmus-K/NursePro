// Reviews Admin JavaScript
function loadReviewsAdmin() {
  loadPendingReviews();
  loadApprovedReviews();
  updateAdminStats();
}

function updateAdminStats() {
  const pending = reviewsSystem.getReviews(false).length;
  const approved = reviewsSystem.getReviews(true).length;
  const avgRating = reviewsSystem.getAverageRating();
  
  document.getElementById('pendingReviewsCount').textContent = pending;
  document.getElementById('approvedReviewsCount').textContent = approved;
  document.getElementById('avgRatingAdmin').textContent = avgRating;
}

function generateStarsAdmin(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}

function loadPendingReviews() {
  const container = document.getElementById('pendingReviewsList');
  const pending = reviewsSystem.getReviews(false);
  
  if (pending.length === 0) {
    container.innerHTML = '<p>No pending reviews</p>';
    return;
  }
  
  container.innerHTML = pending.map(review => `
    <div class="admin-question">
      <div class="question-header">
        <span class="username">${review.name}</span>
        <span class="date">${review.date}</span>
      </div>
      <div class="review-rating-admin">
        <strong>Rating:</strong> 
        <span style="color: #ffc107; font-size: 1.2rem;">${generateStarsAdmin(review.rating)}</span>
        <span>(${review.rating}/5)</span>
      </div>
      <div class="question-text" style="margin: 15px 0;">${review.comment}</div>
      <div class="admin-actions">
        <button class="btn btn-approve" onclick="approveReview(${review.id})">Approve</button>
        <button class="btn btn-reject" onclick="rejectReview(${review.id})">Reject</button>
        <button class="btn btn-delete" onclick="deleteReview(${review.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function loadApprovedReviews() {
  const container = document.getElementById('approvedReviewsList');
  const approved = reviewsSystem.getReviews(true);
  
  if (approved.length === 0) {
    container.innerHTML = '<p>No approved reviews</p>';
    return;
  }
  
  container.innerHTML = approved.map(review => `
    <div class="admin-question">
      <div class="question-header">
        <span class="username">${review.name}</span>
        <span class="date">${review.date}</span>
      </div>
      <div class="review-rating-admin">
        <strong>Rating:</strong> 
        <span style="color: #ffc107; font-size: 1.2rem;">${generateStarsAdmin(review.rating)}</span>
        <span>(${review.rating}/5)</span>
      </div>
      <div class="question-text" style="margin: 15px 0;">${review.comment}</div>
      <div class="admin-actions">
        <button class="btn btn-reject" onclick="unpublishReview(${review.id})">Unpublish</button>
        <button class="btn btn-delete" onclick="deleteReview(${review.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function approveReview(id) {
  reviewsSystem.updateReview(id, true);
  loadReviewsAdmin();
  alert('Review approved and published!');
}

function rejectReview(id) {
  if (confirm('Are you sure you want to reject this review?')) {
    reviewsSystem.updateReview(id, false);
    loadReviewsAdmin();
    alert('Review rejected');
  }
}

function unpublishReview(id) {
  if (confirm('Are you sure you want to unpublish this review?')) {
    reviewsSystem.updateReview(id, false);
    loadReviewsAdmin();
    alert('Review unpublished');
  }
}

function deleteReview(id) {
  if (confirm('Are you sure you want to delete this review permanently?')) {
    reviewsSystem.deleteReview(id);
    loadReviewsAdmin();
    alert('Review deleted');
  }
}

// Load admin panel when page loads
document.addEventListener('DOMContentLoaded', loadReviewsAdmin);