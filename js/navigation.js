// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");
  const body = document.body; // Mobile menu toggle
  mobileMenuButton.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent propagation to document
    navLinks.classList.toggle("active");

    // Toggle accessibility attributes
    const isExpanded = navLinks.classList.contains("active");
    this.setAttribute("aria-expanded", isExpanded);

    // Toggle body scroll lock and menu-open class when menu is open
    if (isExpanded) {
      body.style.overflow = "hidden";
      body.classList.add("menu-open");
    } else {
      body.style.overflow = "";
      body.classList.remove("menu-open");
    }

    // Change menu icon
    const menuIcon = this.querySelector("i");
    if (isExpanded) {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-times");
    } else {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    }
  }); // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    // Only run if the menu is active
    if (navLinks.classList.contains("active")) {
      // Check if click was outside navbar and not on mobile menu button
      if (
        !e.target.closest(".nav-links") &&
        !e.target.closest(".mobile-menu-button")
      ) {
        navLinks.classList.remove("active");
        body.style.overflow = "";
        body.classList.remove("menu-open");

        // Update accessibility attribute
        mobileMenuButton.setAttribute("aria-expanded", "false");

        const menuIcon = mobileMenuButton.querySelector("i");
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
      }
    }
  }); // Close menu when clicking on a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      body.style.overflow = "";
      body.classList.remove("menu-open");

      // Update accessibility attribute
      mobileMenuButton.setAttribute("aria-expanded", "false");

      const menuIcon = mobileMenuButton.querySelector("i");
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");

      // Add small delay to allow smooth scrolling after menu closes
      setTimeout(() => {
        const href = link.getAttribute("href");
        if (href.startsWith("#")) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 300);
    });
  });

  // Keyboard accessibility
  document.addEventListener("keydown", function (e) {
    // Close menu on Escape key
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      body.style.overflow = "";
      body.classList.remove("menu-open");
      mobileMenuButton.setAttribute("aria-expanded", "false");

      const menuIcon = mobileMenuButton.querySelector("i");
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    }
  });

  // Highlight active section in navigation
  const sections = document.querySelectorAll("section[id]");

  function highlightNavigation() {
    const scrollPosition = window.scrollY + 100; // Offset for navbar height

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Remove active class from all links
        document.querySelectorAll(".nav-links a").forEach((link) => {
          link.classList.remove("active-link");
        });

        // Add active class to corresponding link
        const activeLink = document.querySelector(
          `.nav-links a[href="#${sectionId}"]`
        );
        if (activeLink) {
          activeLink.classList.add("active-link");
        }
      }
    });
  }

  window.addEventListener("scroll", highlightNavigation);
  window.addEventListener("load", highlightNavigation);
  // Navbar background on scroll
  function updateNavbarOnScroll() {
    const currentScroll = window.scrollY;

    // Check if scrolled down more than threshold
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Check scroll direction for potential animations
    if (currentScroll > lastScroll && currentScroll > 300) {
      // Scrolling down - only hide if menu is closed
      if (!navLinks.classList.contains("active")) {
        navbar.classList.add("navbar-hidden");
      }
    } else {
      // Scrolling up
      navbar.classList.remove("navbar-hidden");
    }

    lastScroll = currentScroll;
  }

  let lastScroll = 0;
  window.addEventListener("scroll", updateNavbarOnScroll);
  window.addEventListener("load", updateNavbarOnScroll);
  window.addEventListener("resize", updateNavbarOnScroll);
});
