// Mock database - replace with actual database
let questions = [
  { id: 1, question_text: "How long does it take to complete an assignment?", answer_text: "Typically 2-5 days depending on complexity and urgency.", category: "assignments", username: "Sarah_RN", created_at: "2025-01-15T00:00:00Z", approved: true },
  { id: 2, question_text: "Do you help with nursing exams?", answer_text: "Yes, we provide comprehensive exam preparation and support.", category: "exams", username: "Mike_Student", created_at: "2025-01-14T00:00:00Z", approved: true }
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const approvedQuestions = questions.filter(q => q.approved);
  res.status(200).json({ success: true, data: approvedQuestions });
}