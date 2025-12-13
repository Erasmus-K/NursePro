// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger toggle for mobile
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-controls", "primary-navigation");
  navLinks.setAttribute("id", "primary-navigation");

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });
}

// Dropdown toggle for mobile
const dropdownParents = document.querySelectorAll(".nav-links ul li");

dropdownParents.forEach((parent) => {
  const dropdown = parent.querySelector(".dropdown");
  if (dropdown) {
    parent.addEventListener("click", (e) => {
      const target = e.target;
      if (
        target &&
        target.tagName === "A" &&
        target.nextElementSibling === dropdown
      ) {
        e.preventDefault();
        if (window.matchMedia("(max-width: 768px)").matches) {
          parent.parentElement
            .querySelectorAll(".dropdown.show")
            .forEach((openEl) => {
              if (openEl !== dropdown) openEl.classList.remove("show");
            });
        }
        dropdown.classList.toggle("show");
      }
    });
  }
});

// Blog Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.blog-slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
  updateDots();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Blog slider controls
document.querySelector('.next-btn')?.addEventListener('click', nextSlide);
document.querySelector('.prev-btn')?.addEventListener('click', prevSlide);

// Create and handle dots
function createDots() {
  const dotsContainer = document.querySelector('.slider-dots');
  if (dotsContainer) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentSlide = i;
        showSlide(currentSlide);
      });
      dotsContainer.appendChild(dot);
    }
  }
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Testimonials auto-slider
let testimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
  if (testimonialCards.length > 0) {
    testimonialCards.forEach(card => card.style.opacity = '0.7');
    testimonialCards[testimonialIndex].style.opacity = '1';
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  }
}

// Stats counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.stat-card h3');
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = counter.textContent.replace(/[0-9,]+/, target.toLocaleString());
        clearInterval(timer);
      } else {
        counter.textContent = counter.textContent.replace(/[0-9,]+/, Math.floor(current).toLocaleString());
      }
    }, 20);
  });
}

// Image loading optimization
function optimizeImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.onload = () => img.classList.add('loaded');
        if (img.complete) img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Q&A Data Structure
const qaData = {
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
    }
  ],

  getApprovedQuestions() {
    return this.questions.filter(q => q.approved);
  },

  addQuestion(questionText, username = 'Anonymous') {
    const newQuestion = {
      id: this.questions.length + 1,
      questionText: questionText,
      answerText: "Thank you for your question! We'll respond soon.",
      username: username,
      date: new Date().toISOString().split('T')[0],
      approved: false
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }
};

function loadQuestions() {
  const container = document.getElementById('questionsContainer');
  if (!container) return;
  
  const approvedQuestions = qaData.getApprovedQuestions();
  container.innerHTML = approvedQuestions.map(q => `
    <div class="question-item" onclick="toggleAnswer(${q.id})">
      <div class="question-text">${q.questionText}</div>
      <div class="answer-text" id="answer-${q.id}">${q.answerText}</div>
      <div class="question-meta">
        <span class="username">Asked by: ${q.username}</span>
        <span class="question-date">${q.date}</span>
      </div>
    </div>
  `).join('');
}

function toggleAnswer(id) {
  const questionItem = document.querySelector(`#answer-${id}`).parentElement;
  questionItem.classList.toggle('active');
}

function addQuestion(questionText, username = 'Anonymous') {
  qaData.addQuestion(questionText, username);
  loadQuestions();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createDots();
  optimizeImages();
  loadQuestions();
  
  // Q&A form handler
  const questionForm = document.getElementById('questionForm');
  if (questionForm) {
    questionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const questionInput = document.getElementById('questionInput');
      const usernameInput = document.getElementById('usernameInput');
      
      if (questionInput.value.trim()) {
        const username = usernameInput.value.trim() || 'Anonymous';
        addQuestion(questionInput.value.trim(), username);
        questionInput.value = '';
        usernameInput.value = '';
        alert('Question submitted! We\'ll respond soon.');
      }
    });
  }
  
  // Start testimonial rotation
  setInterval(rotateTestimonials, 5000);
  
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = '0.2s';
        entry.target.classList.add('fade-in');
        
        // Animate counters for stats section
        if (entry.target.classList.contains('stats-section')) {
          setTimeout(animateCounters, 300);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all sections with fade-in class
  document.querySelectorAll('.fade-in').forEach(section => {
    observer.observe(section);
  });
});