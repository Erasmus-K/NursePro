// Mock database - replace with actual database
let questions = [
  { id: 1, question_text: "How long does it take to complete an assignment?", answer_text: "Typically 2-5 days depending on complexity and urgency.", category: "assignments", username: "Sarah_RN", created_at: "2025-01-15T00:00:00Z", approved: true },
  { id: 2, question_text: "Do you help with nursing exams?", answer_text: "Yes, we provide comprehensive exam preparation and support.", category: "exams", username: "Mike_Student", created_at: "2025-01-14T00:00:00Z", approved: true },
  { id: 3, question_text: "What is your pricing?", answer_text: "", category: "general", username: "NewUser", created_at: "2025-01-16T00:00:00Z", approved: false }
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple admin auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const pendingQuestions = questions.filter(q => !q.approved);
  res.status(200).json({ success: true, data: pendingQuestions });
}