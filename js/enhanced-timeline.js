// Enhanced Timeline Advanced Animations and Interactions
// Uses unique variable names to avoid conflicts with existing timeline code

// Performance optimization: Throttle scroll events
let enhancedScrollTimeout = null;
const enhancedThrottleDelay = 16; // ~60fps

// Debounce function for resize events
function enhancedDebounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Enhanced Timeline Main Initialization
  function initEnhancedTimelineAnimations() {
    const enhancedTimelineWrapper = document.querySelector(
      ".enhanced-timeline-wrapper"
    );
    const enhancedTimelineContainer = document.querySelector(
      ".enhanced-timeline-container"
    );
    const enhancedProgressFill = document.querySelector(
      ".enhanced-progress-fill"
    );
    const enhancedTimelineItems = document.querySelectorAll(
      ".enhanced-timeline-item"
    );
    const enhancedProgressDots = document.querySelectorAll(
      ".enhanced-progress-dot"
    );

    if (!enhancedTimelineWrapper || !enhancedTimelineContainer) {
      console.log("Enhanced timeline elements not found");
      return;
    }

    // Enhanced Timeline Progress Tracking
    function updateEnhancedTimelineProgress() {
      const containerRect = enhancedTimelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;

      // Calculate progress based on scroll position
      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (windowHeight - containerTop) / (windowHeight + containerHeight * 0.5)
        )
      );

      // Update progress bar
      if (enhancedProgressFill) {
        gsap.to(enhancedProgressFill, {
          height: `${scrollProgress * 100}%`,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Update active timeline items based on scroll
      enhancedTimelineItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const isActive =
          itemCenter < windowHeight * 0.7 && itemCenter > windowHeight * 0.3;

        item.classList.toggle("enhanced-active", isActive);

        // Update corresponding progress dot
        if (enhancedProgressDots[index]) {
          enhancedProgressDots[index].classList.toggle(
            "enhanced-active",
            isActive
          );
        }
      });
    }

    // Enhanced Timeline Item Animations
    function initEnhancedTimelineItemAnimations() {
      enhancedTimelineItems.forEach((item, index) => {
        const enhancedContentCard = item.querySelector(
          ".enhanced-content-card"
        );
        const enhancedTimelineIcon = item.querySelector(
          ".enhanced-timeline-icon"
        );
        const enhancedMarkerDot = item.querySelector(".enhanced-marker-dot");
        const enhancedListItems = item.querySelectorAll(".enhanced-list-item");
        const enhancedProgressBadge = item.querySelector(
          ".enhanced-progress-badge"
        );

        // Create timeline for this item
        const enhancedItemTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              item.classList.add("enhanced-in-view");
            },
            onLeave: () => {
              item.classList.remove("enhanced-in-view");
            },
            onEnterBack: () => {
              item.classList.add("enhanced-in-view");
            },
            onLeaveBack: () => {
              item.classList.remove("enhanced-in-view");
            },
          },
        }); // Animate marker dot (subtle since timeline is visible)
        if (enhancedMarkerDot) {
          enhancedItemTimeline.from(
            enhancedMarkerDot,
            {
              scale: 0.8,
              duration: 0.4,
              ease: "back.out(1.7)",
            },
            0
          );
        } // Animate content card with alternating directions
        if (enhancedContentCard) {
          const isEven = index % 2 === 0;
          enhancedItemTimeline.from(
            enhancedContentCard,
            {
              x: isEven ? 50 : -50, // Even items come from right, odd from left
              scale: 0.95,
              duration: 0.6,
              ease: "power3.out",
            },
            0.1
          );
        } // Animate icon (subtle since timeline is visible)
        if (enhancedTimelineIcon) {
          enhancedItemTimeline.from(
            enhancedTimelineIcon,
            {
              scale: 0.8,
              rotation: -90,
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            0.3
          );
        } // Animate progress badge (subtle since timeline is visible)
        if (enhancedProgressBadge) {
          enhancedItemTimeline.from(
            enhancedProgressBadge,
            {
              scale: 0.9,
              y: 10,
              duration: 0.4,
              ease: "back.out(1.7)",
            },
            0.5
          );
        } // Stagger animate list items (subtle animation since they're already visible)
        if (enhancedListItems.length > 0) {
          enhancedItemTimeline.from(
            enhancedListItems,
            {
              y: 10,
              scale: 0.95,
              duration: 0.4,
              stagger: 0.05,
              ease: "power2.out",
            },
            0.6
          );
        }
      });
    }

    // Enhanced Progress Dot Click Navigation
    function initEnhancedProgressDotNavigation() {
      enhancedProgressDots.forEach((dot, index) => {
        dot.addEventListener("click", (e) => {
          e.preventDefault();

          // Add click feedback
          gsap.to(dot, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          });

          // Scroll to corresponding timeline item
          const targetItem = enhancedTimelineItems[index];
          if (targetItem) {
            gsap.to(window, {
              duration: 1.2,
              scrollTo: {
                y: targetItem,
                offsetY: 100,
              },
              ease: "power3.inOut",
            });
          }
        });

        // Enhanced hover effects for progress dots
        dot.addEventListener("mouseenter", () => {
          gsap.to(dot, {
            scale: 1.2,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        });

        dot.addEventListener("mouseleave", () => {
          gsap.to(dot, {
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        });
      });
    }

    // Enhanced Timeline Hover Effects
    function initEnhancedTimelineHoverEffects() {
      enhancedTimelineItems.forEach((item) => {
        const enhancedContentCard = item.querySelector(
          ".enhanced-content-card"
        );
        const enhancedTimelineIcon = item.querySelector(
          ".enhanced-timeline-icon"
        );

        if (enhancedContentCard) {
          enhancedContentCard.addEventListener("mouseenter", () => {
            gsap.to(enhancedContentCard, {
              y: -10,
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
            });

            if (enhancedTimelineIcon) {
              gsap.to(enhancedTimelineIcon, {
                rotation: 360,
                scale: 1.1,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });

          enhancedContentCard.addEventListener("mouseleave", () => {
            gsap.to(enhancedContentCard, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });

            if (enhancedTimelineIcon) {
              gsap.to(enhancedTimelineIcon, {
                rotation: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });
        }
      });
    }

    // Enhanced Timeline Parallax Effect
    function initEnhancedTimelineParallax() {
      const enhancedTrack = document.querySelector(".enhanced-timeline-track");

      if (enhancedTrack) {
        gsap.to(enhancedTrack, {
          backgroundPosition: "0% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: enhancedTimelineContainer,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }

    // Enhanced Timeline Intersection Observer for Performance
    function initEnhancedTimelineIntersectionObserver() {
      const enhancedObserverOptions = {
        root: null,
        rootMargin: "0px",
        threshold: [0.1, 0.5, 0.9],
      };

      const enhancedTimelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            entry.target.classList.add("enhanced-observed");
          }
        });
      }, enhancedObserverOptions);

      enhancedTimelineItems.forEach((item) => {
        enhancedTimelineObserver.observe(item);
      });
    }

    // Enhanced Timeline Responsive Behavior
    function initEnhancedTimelineResponsive() {
      function checkEnhancedTimelineMobile() {
        const isMobile = window.innerWidth <= 768;
        enhancedTimelineWrapper.classList.toggle(
          "enhanced-mobile-layout",
          isMobile
        );

        // Adjust animations for mobile
        if (isMobile) {
          // Refresh ScrollTrigger for mobile layout changes
          ScrollTrigger.refresh();
        }
      }

      checkEnhancedTimelineMobile();
      window.addEventListener(
        "resize",
        enhancedDebounce(() => {
          checkEnhancedTimelineMobile();
        }, 100)
      );
    }

    // Initialize all enhanced timeline features
    updateEnhancedTimelineProgress();
    initEnhancedTimelineItemAnimations();
    initEnhancedProgressDotNavigation();
    initEnhancedTimelineHoverEffects();
    initEnhancedTimelineParallax();
    initEnhancedTimelineIntersectionObserver();
    initEnhancedTimelineResponsive();

    // Update progress on scroll
    window.addEventListener("scroll", () => {
      if (enhancedScrollTimeout) {
        clearTimeout(enhancedScrollTimeout);
      }
      enhancedScrollTimeout = setTimeout(
        updateEnhancedTimelineProgress,
        enhancedThrottleDelay
      );
    });

    // Enhanced Timeline Auto-play (optional feature)
    function initEnhancedTimelineAutoplay() {
      let enhancedAutoplayInterval;
      let enhancedCurrentIndex = 0;

      function enhancedAutoplayNext() {
        if (enhancedCurrentIndex < enhancedTimelineItems.length - 1) {
          enhancedCurrentIndex++;
        } else {
          enhancedCurrentIndex = 0;
        }

        const targetItem = enhancedTimelineItems[enhancedCurrentIndex];
        if (targetItem) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: {
              y: targetItem,
              offsetY: 100,
            },
            ease: "power3.inOut",
          });
        }
      }

      // Auto-play controls (can be enabled via data attribute)
      if (enhancedTimelineWrapper.dataset.autoplay === "true") {
        enhancedAutoplayInterval = setInterval(enhancedAutoplayNext, 5000);

        // Pause on hover
        enhancedTimelineWrapper.addEventListener("mouseenter", () => {
          clearInterval(enhancedAutoplayInterval);
        });

        enhancedTimelineWrapper.addEventListener("mouseleave", () => {
          enhancedAutoplayInterval = setInterval(enhancedAutoplayNext, 5000);
        });
      }
    }

    // Optional: Initialize autoplay if enabled
    initEnhancedTimelineAutoplay();

    console.log("Enhanced timeline animations initialized successfully");
  }
  // Enhanced Timeline Loading Animation
  function initEnhancedTimelineLoading() {
    const enhancedTimelineWrapper = document.querySelector(
      ".enhanced-timeline-wrapper"
    );
    if (enhancedTimelineWrapper) {
      // Set initial loading state
      enhancedTimelineWrapper.classList.add("loaded");

      // Since timeline is now visible by default, just add a subtle entrance animation
      gsap.fromTo(
        enhancedTimelineWrapper,
        {
          scale: 0.95,
          y: 20,
        },
        {
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          onComplete: () => {
            // Trigger any additional initialization
            enhancedTimelineWrapper.setAttribute("data-loaded", "true");
          },
        }
      );
    }
  }

  // Initialize enhanced timeline when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initEnhancedTimelineLoading();
      initEnhancedTimelineAnimations();
    });
  } else {
    initEnhancedTimelineLoading();
    initEnhancedTimelineAnimations();
  }

  // Enhanced Timeline Accessibility Features
  function initEnhancedTimelineAccessibility() {
    const enhancedTimelineItems = document.querySelectorAll(
      ".enhanced-timeline-item"
    );
    const enhancedProgressDots = document.querySelectorAll(
      ".enhanced-progress-dot"
    );

    // Add keyboard navigation
    enhancedProgressDots.forEach((dot, index) => {
      dot.setAttribute("tabindex", "0");
      dot.setAttribute("role", "button");
      dot.setAttribute("aria-label", `Navigate to timeline item ${index + 1}`);

      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dot.click();
        }
      });
    });

    // Add ARIA labels to timeline items
    enhancedTimelineItems.forEach((item, index) => {
      item.setAttribute("aria-label", `Timeline milestone ${index + 1}`);
    });

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add(
        "enhanced-timeline-reduced-motion"
      );
    }
  }

  initEnhancedTimelineAccessibility();
});
