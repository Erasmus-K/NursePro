// Q&A Data Structure
const qaDatabase = {
  questions: [
    {
      id: 1,
      questionText: "How long does it take to complete a nursing assignment?",
      answerText: "Typically 2-5 days depending on complexity, length, and urgency level.",
      username: "Sarah_RN",
      date: "2025-01-15",
      approved: true
    },
    {
      id: 2,
      questionText: "Do you help with NCLEX exam preparation?",
      answerText: "Yes, we provide comprehensive NCLEX prep including practice questions and study guides.",
      username: "Mike_Student",
      date: "2025-01-14",
      approved: true
    },
    {
      id: 3,
      questionText: "What's your refund policy?",
      answerText: "We offer full refunds if you're not satisfied with our service quality.",
      username: "Jennifer_K",
      date: "2025-01-13",
      approved: true
    },
    {
      id: 4,
      questionText: "Can you help with clinical case studies?",
      answerText: "Absolutely! We specialize in nursing case studies and care plans.",
      username: "Alex_Nurse",
      date: "2025-01-12",
      approved: false
    }
  ],

  // Add new question
  addQuestion(questionText, username) {
    const newQuestion = {
      id: this.questions.length + 1,
      questionText: questionText,
      answerText: "",
      username: username,
      date: new Date().toISOString().split('T')[0],
      approved: false
    };
    this.questions.push(newQuestion);
    return newQuestion;
  },

  // Get approved questions only
  getApprovedQuestions() {
    return this.questions.filter(q => q.approved);
  },

  // Get pending questions (for admin)
  getPendingQuestions() {
    return this.questions.filter(q => !q.approved);
  },

  // Approve question and add answer
  approveQuestion(id, answerText) {
    const question = this.questions.find(q => q.id === id);
    if (question) {
      question.approved = true;
      question.answerText = answerText;
    }
    return question;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = qaDatabase;
}