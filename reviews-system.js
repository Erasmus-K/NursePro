// Reviews System with Local Storage and Enhanced Features
const reviewsSystem = {
  // Initialize with sample data
  reviews: [
    { id: 1, name: "Sarah Johnson", rating: 5, comment: "Excellent service! They helped me complete my nursing thesis on time. The quality was outstanding and the support was available 24/7.", date: "2025-01-15", approved: true, helpful: 12 },
    { id: 2, name: "Mike Chen", rating: 4, comment: "Very professional and knowledgeable. Great support for my assignments. Only minor issue was communication could be faster.", date: "2025-01-14", approved: true, helpful: 8 },
    { id: 3, name: "Emma Wilson", rating: 5, comment: "Outstanding quality work. Highly recommend for nursing students! They understand the requirements perfectly.", date: "2025-01-13", approved: true, helpful: 15 },
    { id: 4, name: "David Brown", rating: 4, comment: "Good service overall. The work was well-researched and properly formatted. Delivery was on time as promised.", date: "2025-01-12", approved: true, helpful: 6 },
    { id: 5, name: "Lisa Martinez", rating: 5, comment: "Amazing experience! They helped me with my NCLEX preparation and I passed on the first try. Thank you so much!", date: "2025-01-11", approved: true, helpful: 20 }
  ],

  // Load from localStorage
  loadReviews() {
    try {
      const stored = localStorage.getItem('nurseProReviews');
      if (stored) {
        this.reviews = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Keep default reviews if localStorage is corrupted
    }
  },

  // Save to localStorage with error handling
  saveReviews() {
    try {
      localStorage.setItem('nurseProReviews', JSON.stringify(this.reviews));
      return true;
    } catch (error) {
      console.error('Error saving reviews:', error);
      return false;
    }
  },

  // Add new review with validation
  addReview(name, rating, comment) {
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!comment || comment.trim().length < 10) {
      throw new Error('Comment must be at least 10 characters long');
    }
    
    const newReview = {
      id: Date.now(),
      name: name?.trim() || 'Anonymous',
      rating: parseInt(rating),
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      approved: false,
      helpful: 0
    };
    
    this.reviews.push(newReview);
    
    if (!this.saveReviews()) {
      // Remove the review if save failed
      this.reviews.pop();
      throw new Error('Failed to save review. Please try again.');
    }
    
    return newReview;
  },

  // Get reviews by status with pagination
  getReviews(status, page = 1, limit = 10) {
    const filtered = this.reviews.filter(r => r.approved === status);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      reviews: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      hasMore: endIndex < filtered.length,
      currentPage: page
    };
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
    const initialLength = this.reviews.length;
    this.reviews = this.reviews.filter(r => r.id != id);
    
    if (this.reviews.length < initialLength) {
      this.saveReviews();
      return true;
    }
    return false;
  },

  // Mark review as helpful
  markHelpful(id) {
    const review = this.reviews.find(r => r.id == id);
    if (review) {
      review.helpful = (review.helpful || 0) + 1;
      this.saveReviews();
      return review.helpful;
    }
    return 0;
  },

  // Calculate average rating
  getAverageRating() {
    const approved = this.reviews.filter(r => r.approved);
    if (approved.length === 0) return 0;
    const sum = approved.reduce((acc, r) => acc + r.rating, 0);
    return (sum / approved.length).toFixed(1);
  },

  // Get rating distribution
  getRatingDistribution() {
    const approved = this.reviews.filter(r => r.approved);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    approved.forEach(review => {
      distribution[review.rating]++;
    });
    
    return distribution;
  },

  // Get total count
  getTotalCount() {
    return this.reviews.filter(r => r.approved).length;
  },

  // Sort reviews with more options
  sortReviews(sortBy) {
    const approved = this.reviews.filter(r => r.approved);
    
    switch(sortBy) {
      case 'latest':
        return approved.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return approved.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return approved.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return approved.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return approved.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
      default:
        return approved;
    }
  },

  // Search reviews
  searchReviews(query) {
    const approved = this.reviews.filter(r => r.approved);
    if (!query) return approved;
    
    const searchTerm = query.toLowerCase();
    return approved.filter(review => 
      review.comment.toLowerCase().includes(searchTerm) ||
      review.name.toLowerCase().includes(searchTerm)
    );
  },

  // Get reviews by rating
  getReviewsByRating(rating) {
    return this.reviews.filter(r => r.approved && r.rating === rating);
  }
};

// Initialize on load
reviewsSystem.loadReviews();