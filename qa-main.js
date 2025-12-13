// Main Q&A JavaScript for public page
let userQuestions = []; // Store user's submitted questions

// Display approved questions
function displayApprovedQuestions() {
  const container = document.getElementById('questionsContainer');
  if (!container) return;
  
  const approved = qaSystem.getQuestions('approved');
  
  if (approved.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">No questions yet. Be the first to ask!</p>';
    return;
  }
  
  container.innerHTML = approved.map(q => `
    <div class="question-item" onclick="toggleAnswer(${q.id})">
      <div class="question-header">
        <span class="username">${q.username}</span>
        <span class="question-date">${q.date}</span>
      </div>
      <div class="question-text">${q.questionText}</div>
      <div class="answer-text" id="answer-${q.id}">${q.answerText}</div>
    </div>
  `).join('');
}

// Toggle answer visibility
function toggleAnswer(id) {
  const questionItem = document.querySelector(`#answer-${id}`).parentElement;
  questionItem.classList.toggle('active');
}

// Submit new question
function submitQuestion() {
  const questionInput = document.getElementById('questionInput');
  const usernameInput = document.getElementById('usernameInput');
  
  if (!questionInput.value.trim()) {
    alert('Please enter a question');
    return;
  }
  
  const username = usernameInput.value.trim() || 'Anonymous';
  const newQuestion = qaSystem.addQuestion(questionInput.value.trim(), username);
  
  // Add to user's questions list
  userQuestions.push(newQuestion);
  
  // Clear form
  questionInput.value = '';
  usernameInput.value = '';
  
  // Show confirmation
  showConfirmation('Question submitted successfully! It will appear after admin approval.');
  
  // Update user questions display
  displayUserQuestions();
}

// Show confirmation message
function showConfirmation(message) {
  // Create confirmation popup
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  popup.textContent = message;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(popup);
  
  // Remove after 3 seconds
  setTimeout(() => {
    popup.remove();
    style.remove();
  }, 3000);
}

// Display user's questions
function displayUserQuestions() {
  let container = document.getElementById('userQuestionsContainer');
  
  if (!container) {
    // Create user questions section if it doesn't exist
    const qaContainer = document.querySelector('.qa-container');
    const userSection = document.createElement('div');
    userSection.className = 'user-questions';
    userSection.innerHTML = `
      <h3>Your Questions</h3>
      <div id="userQuestionsContainer"></div>
    `;
    qaContainer.appendChild(userSection);
    container = document.getElementById('userQuestionsContainer');
  }
  
  if (userQuestions.length === 0) {
    container.innerHTML = '<p style="color: #666;">You haven\'t asked any questions yet.</p>';
    return;
  }
  
  container.innerHTML = userQuestions.map(q => `
    <div class="user-question-item ${q.status}">
      <div class="question-text">${q.questionText}</div>
      <div style="margin-top: 8px;">
        <span class="status-badge status-${q.status}">${q.status}</span>
        <span style="font-size: 0.8rem; color: #666; margin-left: 10px;">${q.date}</span>
      </div>
      ${q.status === 'pending' ? `
        <div class="user-actions">
          <button class="btn-small btn-edit" onclick="editQuestion(${q.id})">Edit</button>
          <button class="btn-small btn-delete" onclick="deleteUserQuestion(${q.id})">Delete</button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// Edit user question
function editQuestion(id) {
  const question = userQuestions.find(q => q.id === id);
  if (!question) return;
  
  const newText = prompt('Edit your question:', question.questionText);
  if (newText && newText.trim()) {
    question.questionText = newText.trim();
    qaSystem.updateQuestion(id, 'pending', '');
    displayUserQuestions();
    showConfirmation('Question updated successfully!');
  }
}

// Delete user question
function deleteUserQuestion(id) {
  if (confirm('Are you sure you want to delete this question?')) {
    userQuestions = userQuestions.filter(q => q.id !== id);
    qaSystem.deleteQuestion(id);
    displayUserQuestions();
    showConfirmation('Question deleted successfully!');
  }
}

// Initialize Q&A system
function initializeQA() {
  displayApprovedQuestions();
  displayUserQuestions();
  
  // Add form event listener
  const form = document.getElementById('questionForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitQuestion();
    });
  }
}

// Load when DOM is ready
document.addEventListener('DOMContentLoaded', initializeQA);