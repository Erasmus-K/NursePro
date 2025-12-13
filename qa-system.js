// Complete Q&A System
const qaSystem = {
  questions: [
    {
      id: 1,
      questionText: "How long does it take to complete a nursing assignment?",
      answerText: "Typically 2-5 days depending on complexity and urgency.",
      username: "Sarah_RN",
      date: "2025-01-15",
      status: "approved" // approved, pending, rejected
    },
    {
      id: 2,
      questionText: "Do you help with NCLEX exam preparation?",
      answerText: "Yes, we provide comprehensive NCLEX prep including practice questions.",
      username: "Mike_Student", 
      date: "2025-01-14",
      status: "approved"
    },
    {
      id: 3,
      questionText: "What are your rates for thesis help?",
      answerText: "",
      username: "Jennifer_K",
      date: "2025-01-13",
      status: "pending"
    }
  ],

  // Get questions by status
  getQuestions(status) {
    return this.questions.filter(q => q.status === status);
  },

  // Add new question
  addQuestion(questionText, username) {
    const newQuestion = {
      id: Date.now(),
      questionText: questionText,
      answerText: "",
      username: username || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    };
    this.questions.push(newQuestion);
    return newQuestion;
  },

  // Update question status and answer
  updateQuestion(id, status, answerText = "") {
    const question = this.questions.find(q => q.id == id);
    if (question) {
      question.status = status;
      if (answerText) question.answerText = answerText;
    }
    return question;
  },

  // Delete question
  deleteQuestion(id) {
    this.questions = this.questions.filter(q => q.id != id);
  },

  // Find question by ID
  findQuestion(id) {
    return this.questions.find(q => q.id == id);
  }
};