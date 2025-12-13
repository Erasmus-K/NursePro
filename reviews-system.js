// Reviews System with Local Storage
const reviewsSystem = {
  // Initialize with sample data
  reviews: [
    { id: 1, name: "Sarah Johnson", rating: 5, comment: "Excellent service! They helped me complete my nursing thesis on time.", date: "2025-01-15", approved: true },
    { id: 2, name: "Mike Chen", rating: 4, comment: "Very professional and knowledgeable. Great support for my assignments.", date: "2025-01-14", approved: true },
    { id: 3, name: "Emma Wilson", rating: 5, comment: "Outstanding quality work. Highly recommend for nursing students!", date: "2025-01-13", approved: false },
    { id: 4, name: "David Brown", rating: 3, comment: "Good service but could be faster.", date: "2025-01-12", approved: true }
  ],

  // Load from localStorage
  loadReviews() {
    const stored = localStorage.getItem('nurseProReviews');
    if (stored) {
      this.reviews = JSON.parse(stored);
    }
  },

  // Save to localStorage
  saveReviews() {
    localStorage.setItem('nurseProReviews', JSON.stringify(this.reviews));
  },

  // Add new review
  addReview(name, rating, comment) {
    const newReview = {
      id: Date.now(),
      name: name || 'Anonymous',
      rating: parseInt(rating),
      comment: comment,
      date: new Date().toISOString().split('T')[0],
      approved: false
    };
    this.reviews.push(newReview);
    this.saveReviews();
    return newReview;
  },

  // Get reviews by status
  getReviews(status) {
    return this.reviews.filter(r => r.approved === status);
  },

  // Update review status
  updateReview(id, approved) {
    const review = this.reviews.find(r => r.id == id);
    if (review) {
      review.approved = approved;
      this.saveReviews();
    }
    return review;
  },

  // Delete review
  deleteReview(id) {
    this.reviews = this.reviews.filter(r => r.id != id);
    this.saveReviews();
  },

  // Calculate average rating
  getAverageRating() {
    const approved = this.getReviews(true);
    if (approved.length === 0) return 0;
    const sum = approved.reduce((acc, r) => acc + r.rating, 0);
    return (sum / approved.length).toFixed(1);
  },

  // Get total count
  getTotalCount() {
    return this.getReviews(true).length;
  },

  // Sort reviews
  sortReviews(sortBy) {
    const approved = this.getReviews(true);
    switch(sortBy) {
      case 'latest':
        return approved.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'highest':
        return approved.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return approved.sort((a, b) => a.rating - b.rating);
      default:
        return approved;
    }
  }
};

// Initialize on load
reviewsSystem.loadReviews();