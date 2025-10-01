// ===================== Counter Animation =====================
const counters = document.querySelectorAll(".counter h3");

counters.forEach(counter => {
  counter.innerText = "0";

  const updateCounter = () => {
    const target = +counter.getAttribute("data-target");
    const current = +counter.innerText;
    const increment = target / 200;

    if (current < target) {
      counter.innerText = `${Math.ceil(current + increment)}`;
      setTimeout(updateCounter, 10);
    } else {
      counter.innerText = target;
    }
  };

  updateCounter();
});

// let btn = document.querySelector("btn");
// btn.addEventListener('mousemove', e => () => {
//   let rect = e.target.getBoundingClientRect();
//   let x = e.clientX * 3 - rect.left;
//   btn.style.setProperty('--x', x + 'deg');
// })

// ===================== Testimonials Slider =====================
let currentTestimonial = 0;
const testimonials = document.querySelectorAll(".testimonial");
const testimonialNextBtn = document.getElementById("next");
const testimonialPrevBtn = document.getElementById("prev");

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.toggle("active", i === index);
  });
}

testimonialNextBtn.addEventListener("click", () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
});

testimonialPrevBtn.addEventListener("click", () => {
  currentTestimonial =
    (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
});

// Auto slide every 5s
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 5000);

// ===================== Navbar Scroll Effect =====================
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ===================== Blog Slider =====================
const slides = document.querySelectorAll(".blog-slide");
const blogPrevBtn = document.querySelector(".prev-btn");
const blogNextBtn = document.querySelector(".next-btn");
const dotsContainer = document.querySelector(".slider-dots");

let currentIndex = 0;

// Generate dots dynamically
slides.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".slider-dots span");

// Function to show slide
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? "flex" : "none";
  });
  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

// Next / Prev buttons
blogNextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
});

blogPrevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});

// Dots click
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    currentIndex = i;
    showSlide(currentIndex);
  });
});

// Initialize first slide
showSlide(currentIndex);
