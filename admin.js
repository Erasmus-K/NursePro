// Admin Panel JavaScript
function loadAdminPanel() {
  loadPendingQuestions();
  loadApprovedQuestions();
  updateStats();
}

function updateStats() {
  const pending = qaSystem.getQuestions('pending').length;
  const approved = qaSystem.getQuestions('approved').length;
  
  document.getElementById('pendingCount').textContent = pending;
  document.getElementById('approvedCount').textContent = approved;
}

function loadPendingQuestions() {
  const container = document.getElementById('pendingList');
  const pending = qaSystem.getQuestions('pending');
  
  if (pending.length === 0) {
    container.innerHTML = '<p>No pending questions</p>';
    return;
  }
  
  container.innerHTML = pending.map(q => `
    <div class="admin-question">
      <div class="question-header">
        <span class="username">${q.username}</span>
        <span class="date">${q.date}</span>
      </div>
      <div class="question-text">${q.questionText}</div>
      <div class="answer-section">
        <textarea class="answer-input" id="answer-${q.id}" placeholder="Type your answer here..."></textarea>
      </div>
      <div class="admin-actions">
        <button class="btn btn-approve" onclick="approveQuestion(${q.id})">Approve</button>
        <button class="btn btn-reject" onclick="rejectQuestion(${q.id})">Reject</button>
        <button class="btn btn-delete" onclick="deleteQuestion(${q.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function loadApprovedQuestions() {
  const container = document.getElementById('approvedList');
  const approved = qaSystem.getQuestions('approved');
  
  if (approved.length === 0) {
    container.innerHTML = '<p>No approved questions</p>';
    return;
  }
  
  container.innerHTML = approved.map(q => `
    <div class="admin-question">
      <div class="question-header">
        <span class="username">${q.username}</span>
        <span class="date">${q.date}</span>
      </div>
      <div class="question-text">${q.questionText}</div>
      <div class="answer-text" style="font-style: italic; color: #666; margin-bottom: 15px;">
        ${q.answerText}
      </div>
      <div class="admin-actions">
        <button class="btn btn-reject" onclick="rejectQuestion(${q.id})">Unpublish</button>
        <button class="btn btn-delete" onclick="deleteQuestion(${q.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function approveQuestion(id) {
  const answerText = document.getElementById(`answer-${id}`).value.trim();
  
  if (!answerText) {
    alert('Please provide an answer before approving');
    return;
  }
  
  qaSystem.updateQuestion(id, 'approved', answerText);
  loadAdminPanel();
  alert('Question approved and published!');
}

function rejectQuestion(id) {
  if (confirm('Are you sure you want to reject this question?')) {
    qaSystem.updateQuestion(id, 'rejected');
    loadAdminPanel();
    alert('Question rejected');
  }
}

function deleteQuestion(id) {
  if (confirm('Are you sure you want to delete this question permanently?')) {
    qaSystem.deleteQuestion(id);
    loadAdminPanel();
    alert('Question deleted');
  }
}

// Load admin panel when page loads
document.addEventListener('DOMContentLoaded', loadAdminPanel);