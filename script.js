// Hamburger toggle for mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Dropdown toggle for mobile
const dropdownParents = document.querySelectorAll('.nav-links ul li');

dropdownParents.forEach(parent => {
  const dropdown = parent.querySelector('.dropdown');
  if (dropdown) {
    parent.addEventListener('click', (e) => {
      // Only toggle if the link itself is clicked
      if (e.target.tagName === "A" && e.target.nextElementSibling === dropdown) {
        e.preventDefault();
        dropdown.classList.toggle('show');
      }
    });
  }
});
