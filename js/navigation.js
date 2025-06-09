// Navigation menu enhancements
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  const menuButton = document.querySelector(".mobile-menu-button");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      this.classList.toggle("active");
      body.classList.toggle("menu-open");

      if (this.classList.contains("active")) {
        this.innerHTML = '<i class="fas fa-times"></i>';
      } else {
        this.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      navLinks &&
      navLinks.classList.contains("active") &&
      !navLinks.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      navLinks.classList.remove("active");
      menuButton.classList.remove("active");
      menuButton.innerHTML = '<i class="fas fa-bars"></i>';
      body.classList.remove("menu-open");
    }
  });

  // Close mobile menu when clicking on navigation links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active");
        menuButton.classList.remove("active");
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        body.classList.remove("menu-open");
      }
    });
  });

  // Add resize handler to fix menu state if window is resized
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      menuButton.classList.remove("active");
      menuButton.innerHTML = '<i class="fas fa-bars"></i>';
      body.classList.remove("menu-open");
    }
  });
});
