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
        // Close other open dropdowns on mobile for a cleaner experience
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
