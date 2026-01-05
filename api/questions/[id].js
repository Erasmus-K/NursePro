// Mock database - replace with actual database
let questions = [
  { id: 1, question_text: "How long does it take to complete an assignment?", answer_text: "Typically 2-5 days depending on complexity and urgency.", category: "assignments", username: "Sarah_RN", created_at: "2025-01-15T00:00:00Z", approved: true },
  { id: 2, question_text: "Do you help with nursing exams?", answer_text: "Yes, we provide comprehensive exam preparation and support.", category: "exams", username: "Mike_Student", created_at: "2025-01-14T00:00:00Z", approved: true },
  { id: 3, question_text: "What is your pricing?", answer_text: "", category: "general", username: "NewUser", created_at: "2025-01-16T00:00:00Z", approved: false }
];

export default function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { id } = req.query;
  const questionId = parseInt(id);
  const questionIndex = questions.findIndex(q => q.id === questionId);

  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }

  if (req.method === 'DELETE') {
    questions.splice(questionIndex, 1);
    return res.status(200).json({ success: true, message: 'Question deleted' });
  }

  if (req.method === 'PUT') {
    const { answer_text } = req.body;
    if (!answer_text) {
      return res.status(400).json({ error: 'Answer text required' });
    }

    questions[questionIndex].answer_text = answer_text;
    questions[questionIndex].approved = true;
    questions[questionIndex].updated_at = new Date().toISOString();

    return res.status(200).json({ success: true, data: questions[questionIndex] });
  }
}