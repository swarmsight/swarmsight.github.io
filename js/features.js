// Feature Tabs Animation
function initFeatureTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  function switchTab(targetId) {
    // Remove active class from all tabs
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => {
      content.classList.remove("active");
      content.style.display = "none";
    });

    // Add active class to clicked tab
    const activeButton = document.querySelector(`[data-tab="${targetId}"]`);
    const activeContent = document.getElementById(targetId);

    if (activeButton && activeContent) {
      activeButton.classList.add("active");
      activeContent.style.display = "block";

      // Animate new content
      gsap.fromTo(
        activeContent,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            activeContent.classList.add("active");
          },
        }
      );

      // Animate visual elements
      const visual = activeContent.querySelector(".tab-visual");
      if (visual) {
        gsap.from(visual, {
          scale: 0.95,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.2,
        });
      }

      // Stagger list items
      const listItems = activeContent.querySelectorAll(
        ".feature-list-detailed li"
      );
      gsap.from(listItems, {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      });
    }
  }

  // Add click handlers
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab");
      switchTab(targetId);
    });
  });

  // Initialize first tab
  const firstTab = tabButtons[0]?.getAttribute("data-tab");
  if (firstTab) {
    switchTab(firstTab);
  }
}

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", initFeatureTabs);
