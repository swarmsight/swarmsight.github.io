// Feature Tabs Animation
function initFeatureTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(targetId) {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Add active class to clicked tab
        const activeButton = document.querySelector(`[data-tab="${targetId}"]`);
        const activeContent = document.getElementById(targetId);
        
        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.style.display = 'block';

            // Animate new content
            gsap.fromTo(activeContent, 
                { 
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    onComplete: () => {
                        activeContent.classList.add('active');
                    }
                }
            );

            // Animate visual elements
            const visual = activeContent.querySelector('.tab-visual');
            if (visual) {
                gsap.from(visual, {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    delay: 0.2
                });
            }

            // Stagger list items
            const listItems = activeContent.querySelectorAll('.feature-list-detailed li');
            gsap.from(listItems, {
                x: -20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.3
            });
        }
    }

    // Add click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab');
            switchTab(targetId);
        });
    });

    // Initialize first tab
    const firstTab = tabButtons[0]?.getAttribute('data-tab');
    if (firstTab) {
        switchTab(firstTab);
    }
}

document.addEventListener("DOMContentLoaded", function () {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Navigation scroll effect with GSAP
  const navbar = document.querySelector(".navbar");

  // Create a smoother navbar transition with GSAP
  gsap.to(navbar, {
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "50px",
      onEnter: () => navbar.classList.add("scrolled"),
      onLeaveBack: () => navbar.classList.remove("scrolled"),
      toggleActions: "play none none reverse",
    },
  });
  // Mobile menu toggle with enhanced animations
  const menuButton = document.querySelector(".mobile-menu-button");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      this.classList.toggle("active");
      body.classList.toggle("menu-open"); // Prevent scrolling when menu is open

      if (this.classList.contains("active")) {
        this.innerHTML = '<i class="fas fa-times"></i>';
        // Animate menu items with stagger
        gsap.fromTo(
          ".nav-links a",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" }
        );
      } else {
        this.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  // Close mobile menu when clicking outside or on a menu item
  document.addEventListener("click", function (event) {
    const isMenuButton = event.target.closest(".mobile-menu-button");
    const isMenuLink = event.target.closest(".nav-links a");
    if (
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

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: "smooth",
        });

        // Hide mobile menu after click
        if (window.innerWidth < 768) {
          navLinks.style.display = "none";
        }
      }
    });
  });

  // Add animation classes when elements come into view
  const animatedElements = document.querySelectorAll(
    ".feature-card, .process-step, .timeline-item, .social-link"
  );

  // Enhanced intersection observer with more sophisticated animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Apply varying animations based on element type
          if (entry.target.classList.contains("feature-card")) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          } else if (entry.target.classList.contains("process-step")) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateX(0)";
            }, entry.target.dataset.index * 200 || 0);
          } else if (entry.target.classList.contains("timeline-item")) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, entry.target.dataset.index * 150 || 0);
          } else if (entry.target.classList.contains("social-link")) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0) scale(1)";
            }, parseInt(entry.target.dataset.index) * 100 || 0);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Set initial states and add data attributes for staggered animations
  animatedElements.forEach((element, index) => {
    // Set base styles for animations
    element.style.opacity = "0";
    element.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";

    // Add indexes for staggered animations
    element.dataset.index = index % 6;

    // Set initial transforms based on element type
    if (element.classList.contains("feature-card")) {
      element.style.transform = "translateY(40px)";
    } else if (element.classList.contains("process-step")) {
      element.style.transform = "translateX(-40px)";
    } else if (element.classList.contains("timeline-item")) {
      element.style.transform = "translateY(30px)";
    } else if (element.classList.contains("social-link")) {
      element.style.transform = "translateY(30px) scale(0.95)";
    }

    observer.observe(element);
  });

  // Parallax effects for hero section
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    window.addEventListener("scroll", function () {
      const scrollPosition = window.scrollY;
      const heroHeight = heroSection.offsetHeight;
      const parallaxRatio = scrollPosition / heroHeight;

      const heroContent = document.querySelector(".hero-content");
      if (heroContent) {
        heroContent.style.transform = `translateY(${parallaxRatio * 50}px)`;
        heroContent.style.opacity = 1 - parallaxRatio * 1.5;
      }

      // Move the swarm animation based on scroll
      const swarmAnim = document.querySelector(".swarm-animation");
      if (swarmAnim) {
        swarmAnim.style.transform = `translateY(${
          parallaxRatio * 70
        }px) scale(${1 - parallaxRatio * 0.2})`;
      }
    });
  }

  // Typing effect for the tagline
  const tagline = document.querySelector(".tagline p");
  if (tagline) {
    const originalText = tagline.innerText;
    tagline.innerHTML = "";

    // Create observer for typing effect
    const taglineObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        typeText(originalText, tagline);
        taglineObserver.unobserve(tagline);
      }
    });

    taglineObserver.observe(tagline);
  }

  function typeText(text, element) {
    let index = 0;
    element.innerHTML = "|";

    const interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML = text.substring(0, index + 1) + "|";
        index++;
      } else {
        element.innerHTML = text;
        // Add blinking cursor
        setTimeout(() => {
          element.innerHTML = text + '<span class="cursor">|</span>';
          // Add cursor CSS
          const style = document.createElement("style");
          style.innerHTML = `
            .cursor {
              animation: blink 1s infinite;
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }, 500);
        clearInterval(interval);
      }
    }, 100);
  }

  // Features tab functionality
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked button and corresponding content
        button.classList.add("active");
        const tabId = button.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
      });
    });
  }

  // Roadmap animation
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
    item.dataset.index = index;
    observer.observe(item);
  });

  // Typing effect for manifesto text
  const typewriterText = document.querySelector(".typewriter-text");
  if (typewriterText) {
    typewriterText.style.width = "0";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start animation when in view
            typewriterText.style.animation =
              "typing 3.5s steps(30, end), blink-caret 0.75s step-end infinite";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(typewriterText);
  }

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Vanta.js background effect for hero section
  let vantaEffect = null;
  const vantaContainer = document.getElementById("vanta-animation");

  if (vantaContainer) {
    vantaEffect = VANTA.NET({
      el: vantaContainer,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xf7e94d,
      backgroundColor: 0x0a0a0a,
      points: 9.0,
      maxDistance: 23.0,
      spacing: 18.0,
      showDots: false,
    });
  }

  // Hero section animations using GSAP
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    // Split text animation for the hero title
    const heroTitle = heroContent.querySelector(".hero-title");
    if (heroTitle) {
      let text = heroTitle.textContent;
      heroTitle.innerHTML = "";

      // Create wrapper span
      let wrapper = document.createElement("span");
      wrapper.className = "hero-title-wrapper";
      heroTitle.appendChild(wrapper);

      // Split text into characters
      text.split("").forEach((char, index) => {
        let span = document.createElement("span");
        span.className = "char";
        span.style.animationDelay = `${index * 0.03}s`;
        span.textContent = char === " " ? "\u00A0" : char;
        wrapper.appendChild(span);
      });
    }

    // Animate hero elements
    gsap.fromTo(
      ".badge",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );

    gsap.fromTo(
      ".hero-title .char",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.02,
        ease: "power3.out",
        delay: 0.5,
      }
    );

    gsap.fromTo(
      ".hero-description",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.2 }
    );

    gsap.fromTo(
      ".hero-cta",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.5 }
    );
  }

  // Scroll-triggered animations for sections
  gsap.utils.toArray("section:not(.hero)").forEach((section) => {
    // Animate section headers
    const header = section.querySelector(".section-header");
    if (header) {
      gsap.fromTo(
        header,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  });

  // Feature tabs animation
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabButtons.length > 0) {
    // Slide animation for tabs
    tabButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        // Remove active class
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class
        button.classList.add("active");
        const tabId = button.getAttribute("data-tab");
        const activeContent = document.getElementById(tabId);

        // Animate out current tab
        gsap.to(".tab-content.active", {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            // Animate in new tab
            activeContent.classList.add("active");
            gsap.fromTo(
              activeContent,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );

            // Animate the feature icon
            const icon = activeContent.querySelector(".feature-icon-large");
            if (icon) {
              gsap.fromTo(
                icon,
                { scale: 0.8, rotate: -10 },
                {
                  scale: 1,
                  rotate: 0,
                  duration: 0.8,
                  ease: "elastic.out(1, 0.5)",
                }
              );
            }
          },
        });
      });
    });

    // Initialize first tab
    tabButtons[0].click();
  }

  // Timeline animation
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length > 0) {
    timelineItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: index * 0.2,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }

  // How it works section animation
  const processSteps = document.querySelectorAll(".process-step");
  if (processSteps.length > 0) {
    processSteps.forEach((step, index) => {
      gsap.fromTo(
        step,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          delay: index * 0.3,
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }

  // Add parallax effect to floating elements
  const floatingElements = document.querySelectorAll(".floating-element");
  if (floatingElements.length > 0) {
    floatingElements.forEach((el, index) => {
      gsap.to(el, {
        y: (i) => (i % 2 === 0 ? "+=30" : "-=30"),
        x: (i) => (i % 2 === 0 ? "+=20" : "-=20"),
        rotation: (i) => (i % 2 === 0 ? "+=5" : "-=5"),
        duration: 3 + index,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }

  // Feature Tabs Animation
  function initFeatureTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(targetId) {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Add active class to clicked tab
        const activeButton = document.querySelector(`[data-tab="${targetId}"]`);
        const activeContent = document.getElementById(targetId);
        
        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.style.display = 'block';

            // Animate new content
            gsap.fromTo(activeContent, 
                { 
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    onComplete: () => {
                        activeContent.classList.add('active');
                    }
                }
            );

            // Animate visual elements
            const visual = activeContent.querySelector('.tab-visual');
            if (visual) {
                gsap.from(visual, {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    delay: 0.2
                });
            }

            // Stagger list items
            const listItems = activeContent.querySelectorAll('.feature-list-detailed li');
            gsap.from(listItems, {
                x: -20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.3
            });
        }
    }

    // Add click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab');
            switchTab(targetId);
        });
    });

    // Initialize first tab
    const firstTab = tabButtons[0]?.getAttribute('data-tab');
    if (firstTab) {
        switchTab(firstTab);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    initFeatureTabs();
});

function createSwarmAnimation(container) {
  const swarmContainer = document.createElement("div");
  swarmContainer.className = "swarm-container";
  swarmContainer.style.position = "absolute";
  swarmContainer.style.top = "0";
  swarmContainer.style.left = "0";
  swarmContainer.style.width = "100%";
  swarmContainer.style.height = "100%";
  swarmContainer.style.overflow = "hidden";
  swarmContainer.style.zIndex = "1";
  container.prepend(swarmContainer);

  // Create a central hub for particles
  const hub = document.createElement("div");
  hub.className = "swarm-hub";
  hub.style.position = "absolute";
  hub.style.width = "80px";
  hub.style.height = "80px";
  hub.style.borderRadius = "50%";
  hub.style.background =
    "radial-gradient(circle, rgba(242,213,2,0.15) 0%, rgba(242,213,2,0) 70%)";
  hub.style.top = "50%";
  hub.style.left = "70%";
  hub.style.transform = "translate(-50%, -50%)";
  hub.style.boxShadow = "0 0 40px rgba(242,213,2,0.15)";
  hub.style.animation = "pulse 4s infinite ease-in-out";
  swarmContainer.appendChild(hub);

  // Add connection lines
  const connectionCanvas = document.createElement("canvas");
  connectionCanvas.style.position = "absolute";
  connectionCanvas.style.top = "0";
  connectionCanvas.style.left = "0";
  connectionCanvas.style.width = "100%";
  connectionCanvas.style.height = "100%";
  connectionCanvas.width = container.offsetWidth;
  connectionCanvas.height = container.offsetHeight;
  swarmContainer.appendChild(connectionCanvas);

  const ctx = connectionCanvas.getContext("2d");

  // Adjust number of particles based on screen size
  const particleCount = window.innerWidth > 768 ? 40 : 20;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(swarmContainer, hub));
  }

  // Animation loop for connections
  function drawConnections() {
    ctx.clearRect(0, 0, connectionCanvas.width, connectionCanvas.height);

    // Draw connections between particles that are close to each other
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      const p1x = (parseInt(p1.style.left) / 100) * connectionCanvas.width;
      const p1y = (parseInt(p1.style.top) / 100) * connectionCanvas.height;

      // Connect to hub
      const hubX = connectionCanvas.width * 0.7;
      const hubY = connectionCanvas.height * 0.5;
      const distToHub = Math.sqrt(
        Math.pow(p1x - hubX, 2) + Math.pow(p1y - hubY, 2)
      );

      if (distToHub < connectionCanvas.width * 0.3) {
        const opacity = (1 - distToHub / (connectionCanvas.width * 0.3)) * 0.2;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(hubX, hubY);
        ctx.strokeStyle = `rgba(242, 213, 2, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Connect to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const p2x = (parseInt(p2.style.left) / 100) * connectionCanvas.width;
        const p2y = (parseInt(p2.style.top) / 100) * connectionCanvas.height;

        const distance = Math.sqrt(
          Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2)
        );

        if (distance < connectionCanvas.width * 0.15) {
          const opacity =
            (1 - distance / (connectionCanvas.width * 0.15)) * 0.2;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.strokeStyle = `rgba(242, 213, 2, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawConnections);
  }

  drawConnections();

  // Handle window resize
  window.addEventListener("resize", function () {
    connectionCanvas.width = container.offsetWidth;
    connectionCanvas.height = container.offsetHeight;
  });
}

function createParticle(container, hub) {
  const particle = document.createElement("div");
  particle.className = "swarm-particle";

  const size = Math.random() * 4 + 2;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const opacity = Math.random() * 0.5 + 0.2;
  const duration = Math.random() * 20 + 15;
  const delay = Math.random() * 5;

  particle.style.position = "absolute";
  particle.style.width = size + "px";
  particle.style.height = size + "px";
  particle.style.borderRadius = "50%";
  particle.style.backgroundColor = "rgba(242, 213, 2, " + opacity + ")";
  particle.style.left = posX + "%";
  particle.style.top = posY + "%";
  particle.style.boxShadow = "0 0 " + size * 2 + "px rgba(242, 213, 2, 0.5)";
  particle.style.zIndex = "2";

  // More complex animation based on distance from hub
  const style = document.createElement("style");
  const animName = "moveParticle" + Math.floor(Math.random() * 10000);

  // Create more natural circular/elliptical paths around the hub
  const centerX = 70; // Hub position X in percentage
  const centerY = 50; // Hub position Y in percentage

  const orbit = Math.random() * 30 + 10; // Random orbit radius
  const direction = Math.random() > 0.5 ? 1 : -1; // Clockwise or counter-clockwise
  const startAngle = Math.random() * Math.PI * 2;
  const eccentricity = Math.random() * 0.5 + 0.5; // Make orbits more elliptical

  // Generate multiple keyframes for smoother animation
  let keyframeString = "";
  const numPoints = 8;
  for (let i = 0; i <= numPoints; i++) {
    const percent = (i / numPoints) * 100;
    const angle = startAngle + direction * (i / numPoints) * Math.PI * 2;

    const x = centerX + Math.cos(angle) * orbit;
    const y = centerY + Math.sin(angle) * orbit * eccentricity;

    // Add some randomness to path
    const jitter = i > 0 && i < numPoints ? Math.random() * 5 - 2.5 : 0;

    keyframeString += `
      ${percent}% {
        transform: translate(${jitter}px, ${jitter}px);
        left: ${x}%;
        top: ${y}%;
      }
    `;
  }

  const keyframes = `
    @keyframes ${animName} {
      ${keyframeString}
    }
  `;

  style.innerHTML = keyframes;
  document.head.appendChild(style);

  particle.style.animation = `${animName} ${duration}s ease-in-out ${delay}s infinite`;

  container.appendChild(particle);
  return particle;
}
