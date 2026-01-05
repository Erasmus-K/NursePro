// Mock database - replace with actual database
let questions = [
  { id: 1, question_text: "How long does it take to complete an assignment?", answer_text: "Typically 2-5 days depending on complexity and urgency.", category: "assignments", username: "Sarah_RN", created_at: "2025-01-15T00:00:00Z", approved: true },
  { id: 2, question_text: "Do you help with nursing exams?", answer_text: "Yes, we provide comprehensive exam preparation and support.", category: "exams", username: "Mike_Student", created_at: "2025-01-14T00:00:00Z", approved: true }
];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question_text, username, category = 'general' } = req.body;

  if (!question_text || !username) {
    return res.status(400).json({ error: 'Question and username required' });
  }

  const newQuestion = {
    id: questions.length + 1,
    question_text,
    answer_text: '',
    category,
    username,
    created_at: new Date().toISOString(),
    approved: false
  };

  questions.push(newQuestion);
  res.status(201).json({ success: true, data: newQuestion });
}