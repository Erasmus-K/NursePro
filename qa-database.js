// Q&A Database - API-based data access layer
const qaDatabase = {
  // Add new question
  async addQuestion(questionText, username) {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText, username })
      });
      const result = await response.json();
      return {
        id: result.id,
        questionText: result.question,
        answerText: result.answer || '',
        username: result.username,
        date: result.date,
        approved: result.approved || false
      };
    } catch (error) {
      console.error('Error adding question:', error);
      return null;
    }
  },

  // Get approved questions only
  async getApprovedQuestions() {
    try {
      const response = await fetch('/api/questions/approved');
      const data = await response.json();
      return data.map(q => ({
        id: q.id,
        questionText: q.question,
        answerText: q.answer,
        username: q.username,
        date: q.date,
        approved: q.approved
      }));
    } catch (error) {
      console.error('Error fetching approved questions:', error);
      return [];
    }
  },

  // Get pending questions (for admin)
  async getPendingQuestions() {
    try {
      const response = await fetch('/api/questions/pending');
      const data = await response.json();
      return data.map(q => ({
        id: q.id,
        questionText: q.question,
        answerText: q.answer || '',
        username: q.username,
        date: q.date,
        approved: q.approved
      }));
    } catch (error) {
      console.error('Error fetching pending questions:', error);
      return [];
    }
  },

  // Approve question and add answer
  async approveQuestion(id, answerText) {
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answerText, approved: true })
      });
      const result = await response.json();
      return {
        id: result.id,
        questionText: result.question,
        answerText: result.answer,
        username: result.username,
        date: result.date,
        approved: result.approved
      };
    } catch (error) {
      console.error('Error approving question:', error);
      return null;
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = qaDatabase;
}