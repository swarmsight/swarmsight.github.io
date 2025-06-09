// Enhanced animations and effects for SwarmSight landing page
document.addEventListener("DOMContentLoaded", function () {
  // Initialize ScrollTrigger
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

  // Enhanced 3D Card Effect for Perspective Cards
  const perspectiveCards = document.querySelectorAll(".perspective-card");

  perspectiveCards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / (rect.width / 2);
      const deltaY = (y - centerY) / (rect.height / 2);

      const rotateX = deltaY * -10; // Inverse Y for natural tilt
      const rotateY = deltaX * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = "transform 0.1s";

      // Add highlight effect
      const highlight = `rgba(247, 233, 77, ${0.05 + Math.abs(deltaX) * 0.05})`;
      card.style.background = `linear-gradient(to bottom right, rgba(20, 20, 20, 0.8), ${highlight})`;

      // Add moving highlight based on cursor position
      const highlightEl =
        card.querySelector(".card-highlight") || document.createElement("div");
      if (!card.querySelector(".card-highlight")) {
        highlightEl.className = "card-highlight";
        card.appendChild(highlightEl);
      }

      highlightEl.style.opacity = "0.07";
      highlightEl.style.background =
        "radial-gradient(circle 80px at center, var(--primary-color), transparent)";
      highlightEl.style.position = "absolute";
      highlightEl.style.top = "0";
      highlightEl.style.left = "0";
      highlightEl.style.right = "0";
      highlightEl.style.bottom = "0";
      highlightEl.style.pointerEvents = "none";
      highlightEl.style.transform = `translate(${x - 40}px, ${y - 40}px)`;
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.5s, background 0.5s";
      card.style.background = "";

      const highlightEl = card.querySelector(".card-highlight");
      if (highlightEl) {
        highlightEl.style.opacity = "0";
      }
    });
  });

  // Enhanced Vanta.js configuration
  const vantaContainer = document.getElementById("vanta-animation");
  if (vantaContainer && window.VANTA) {
    const vantaEffect = VANTA.NET({
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
      points: 12.0,
      maxDistance: 25.0,
      spacing: 16.0,
      showDots: false,
    });

    // Enhance Vanta effect on scroll
    window.addEventListener("scroll", function () {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector(".hero").offsetHeight;
      const scrollRatio = Math.min(scrollY / heroHeight, 1);

      // Dynamically adjust Vanta parameters based on scroll position
      if (vantaEffect && vantaEffect.options) {
        vantaEffect.setOptions({
          points: 12.0 - scrollRatio * 4, // Reduce points as user scrolls
          maxDistance: 25.0 - scrollRatio * 10, // Reduce connections
          scale: 1.0 + scrollRatio * 0.2, // Increase scale slightly
        });
      }
    });
  }

  // Add mousemove parallax effect to the hero section
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("mousemove", function (e) {
      const width = hero.offsetWidth;
      const height = hero.offsetHeight;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const centerX = width / 2;
      const centerY = height / 2;

      const deltaX = (mouseX - centerX) / centerX;
      const deltaY = (mouseY - centerY) / centerY;

      // Move floating elements
      const floatingElements = document.querySelectorAll(".floating-element");
      floatingElements.forEach((el, index) => {
        const factor = (index + 1) * 15; // Different movement factor for each element
        const x = deltaX * factor;
        const y = deltaY * factor;

        el.style.transform = `translate(${x}px, ${y}px)`;
      });

      // Subtle movement of hero content in opposite direction
      const heroContent = document.querySelector(".hero-content");
      if (heroContent) {
        heroContent.style.transform = `translate(${-deltaX * 10}px, ${
          -deltaY * 10
        }px)`;
      }
    });
  }

  // Enhanced scroll animations for feature cards
  const featureCards = document.querySelectorAll(".feature-card");
  if (featureCards.length > 0 && window.gsap) {
    gsap.from(featureCards, {
      scrollTrigger: {
        trigger: ".feature-grid",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
    });
  }

  // Enhanced animations for network visualization
  const networkVisualization = document.querySelector(".network-visualization");
  if (networkVisualization) {
    // Create animated connection lines
    const canvas = document.createElement("canvas");
    canvas.className = "network-connections";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "0";
    canvas.width = networkVisualization.offsetWidth;
    canvas.height = networkVisualization.offsetHeight;
    networkVisualization.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const nodes = networkVisualization.querySelectorAll(".node");
    const nodePositions = [];

    // Store node positions
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const vizRect = networkVisualization.getBoundingClientRect();

      nodePositions.push({
        x: rect.left - vizRect.left + rect.width / 2,
        y: rect.top - vizRect.top + rect.height / 2,
        radius: rect.width / 2,
        vx: Math.random() * 0.5 - 0.25, // Random velocity for subtle movement
        vy: Math.random() * 0.5 - 0.25,
      });
    });

    // Animation loop for connections
    function animateConnections() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions with subtle movement
      nodePositions.forEach((node, index) => {
        // Only animate secondary and tertiary nodes
        if (index > 0) {
          // Move node
          node.x += node.vx;
          node.y += node.vy;

          // Boundary checking and velocity reversal
          const maxDist = 15; // Maximum distance from original position
          if (Math.abs(node.x - nodePositions[index].x) > maxDist) {
            node.vx *= -1;
          }
          if (Math.abs(node.y - nodePositions[index].y) > maxDist) {
            node.vy *= -1;
          }

          // Update actual DOM node position
          if (nodes[index]) {
            nodes[index].style.transform = `translate(${node.vx * 10}px, ${
              node.vy * 10
            }px)`;
          }
        }
      });

      // Draw connections
      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const node1 = nodePositions[i];
          const node2 = nodePositions[j];

          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Only draw connections within a certain distance
          const maxDistance = 120;
          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const opacity = (1 - distance / maxDistance) * 0.5;

            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(247, 233, 77, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateConnections);
    }

    animateConnections();

    // Handle window resize
    window.addEventListener("resize", function () {
      canvas.width = networkVisualization.offsetWidth;
      canvas.height = networkVisualization.offsetHeight;

      // Recalculate node positions
      nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const vizRect = networkVisualization.getBoundingClientRect();

        nodePositions[index].x = rect.left - vizRect.left + rect.width / 2;
        nodePositions[index].y = rect.top - vizRect.top + rect.height / 2;
      });
    });
  }

  // Add pulse effect to CTA buttons
  const ctaButtons = document.querySelectorAll(".cta-button");
  if (ctaButtons.length > 0 && window.gsap) {
    ctaButtons.forEach((button) => {
      gsap.to(button, {
        boxShadow: "0 0 20px rgba(247, 233, 77, 0.5)",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
    });
  }

  // Enhanced typing effect for manifesto
  const manifestoText = document.querySelector(".typewriter-text");
  if (manifestoText && window.gsap) {
    const text = manifestoText.textContent;
    manifestoText.textContent = "";
    manifestoText.style.opacity = 1;

    // Create observer to start typing when in view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Type each character
          let chars = text.split("");
          let timeline = gsap.timeline();

          // Add cursor
          const cursor = document.createElement("span");
          cursor.className = "cursor";
          cursor.textContent = "|";
          manifestoText.appendChild(cursor);

          // Type each character
          let currentText = "";
          chars.forEach((char, index) => {
            timeline.to(
              {},
              {
                duration: 0.1,
                onComplete: () => {
                  currentText += char;
                  manifestoText.textContent = currentText;
                  manifestoText.appendChild(cursor);
                },
              }
            );
          });

          // Add blinking cursor class after typing
          timeline.to(cursor, {
            opacity: 0,
            repeat: -1,
            yoyo: true,
            duration: 0.5,
          });

          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(manifestoText);
  }

  // NEW: Parallax scrolling effect for sections
  gsap.utils.toArray(".parallax-section").forEach((section) => {
    const depth = section.dataset.depth || 0.2;
    const movement = -(section.offsetHeight * depth);

    gsap.fromTo(
      section.querySelector(".parallax-bg"),
      {
        y: 0,
      },
      {
        y: movement,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  // NEW: Smooth scroll reveal animations
  const revealElements = document.querySelectorAll(".reveal-element");
  revealElements.forEach((element) => {
    gsap.from(element, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // NEW: Split text animation for headers
  const splitTextHeaders = document.querySelectorAll(".split-header");
  splitTextHeaders.forEach((header) => {
    const text = header.textContent;
    header.textContent = "";

    const chars = text.split("");
    chars.forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      header.appendChild(span);
    });

    gsap.from(header.querySelectorAll(".char"), {
      opacity: 0,
      y: 20,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
      },
    });
  });

  // NEW: Scroll-based color transitions
  const colorTransitionElements = document.querySelectorAll(
    "[data-color-transition]"
  );
  colorTransitionElements.forEach((element) => {
    const baseColor = "rgba(247, 233, 77, 0.3)";
    const targetColor = "rgba(247, 233, 77, 0.8)";

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      end: "center 20%",
      scrub: true,
      onUpdate: (self) => {
        // Mix the colors based on scroll progress
        const progress = self.progress;
        element.style.color = progress < 0.5 ? baseColor : targetColor;
        element.style.textShadow = `0 0 ${
          5 + progress * 15
        }px rgba(247, 233, 77, ${0.3 + progress * 0.5})`;
      },
    });
  });

  // NEW: Interactive hover effects for navigation
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      gsap.to(link, {
        scale: 1.1,
        color: "#f7e94d",
        textShadow: "0 0 10px rgba(247, 233, 77, 0.5)",
        duration: 0.3,
      });
    });

    link.addEventListener("mouseleave", () => {
      gsap.to(link, {
        scale: 1,
        color: "",
        textShadow: "",
        duration: 0.3,
      });
    });
  });

  // NEW: Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: targetElement,
          offsetY: 70,
        },
        ease: "power3.inOut",
      });
    });
  });

  // NEW: Add scroll indicator
  const scrollIndicator = document.createElement("div");
  scrollIndicator.className = "scroll-indicator";
  document.body.appendChild(scrollIndicator);

  window.addEventListener("scroll", () => {
    const scrollPercent =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    scrollIndicator.style.width = `${scrollPercent}%`;
  });

  // NEW: Performance optimization - throttle intensive animations on mobile
  function isMobile() {
    return window.innerWidth < 768;
  }

  if (isMobile()) {
    // Reduce animation complexity on mobile devices
    const reducedMotion = document.createElement("style");
    reducedMotion.innerHTML = `
      .floating-element { animation-duration: 10s !important; }
      .pulse-animation { animation-duration: 3s !important; }
    `;
    document.head.appendChild(reducedMotion);
  }

  // NEW: Enhanced timeline animations
  const timelineItems = document.querySelectorAll(".timeline-item");

  // Create an observer for timeline items
  if (timelineItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");

          // Add staggered animation to timeline list items
          const listItems = entry.target.querySelectorAll(".timeline-list li");
          gsap.from(listItems, {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.2,
          });

          // Animate the marker dot
          const markerDot = entry.target.querySelector(".marker-dot");
          if (markerDot) {
            gsap.from(markerDot, {
              scale: 0,
              opacity: 0,
              duration: 0.5,
              ease: "back.out(2)",
            });
          }

          timelineObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    timelineItems.forEach((item) => {
      timelineObserver.observe(item);
    });
  }

  // NEW: Mobile optimization
  function optimizeForMobile() {
    if (window.innerWidth < 768) {
      // Reduce particles in Vanta.js effect
      if (window.VANTA && window.VANTA.NET) {
        const vantaInstance =
          document.querySelector("#vanta-animation").__vantaEffect;
        if (vantaInstance) {
          vantaInstance.setOptions({
            points: 6.0,
            maxDistance: 18.0,
            spacing: 20.0,
            backgroundColor: 0x0a0a0a,
          });
        }
      }

      // Use simpler animations for better performance
      gsap.registerEffect({
        name: "fadeIn",
        effect: (targets, config) => {
          return gsap.to(targets, {
            opacity: 1,
            duration: config.duration || 0.8,
            ease: "power2.out",
            stagger: config.stagger || 0.1,
          });
        },
        defaults: { duration: 0.8, stagger: 0.1 },
        extendTimeline: true,
      });

      // Apply the simpler effect to reveal elements
      const revealElements = document.querySelectorAll(".reveal-element");
      revealElements.forEach((element) => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                gsap.effects.fadeIn(entry.target);
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 }
        );

        observer.observe(element);
      });
    }
  }

  // Run mobile optimization
  optimizeForMobile();

  // Re-run on resize
  window.addEventListener("resize", debounce(optimizeForMobile, 300));

  // Debounce helper function
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  // NEW: Add scroll-triggered animations for sections
  function initScrollAnimations() {
    // Animate section headers on scroll
    gsap.utils.toArray(".section-header").forEach((header) => {
      gsap.from(header, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

    // Animate feature cards with staggered effect
    gsap.utils.toArray(".feature-card").forEach((card, index) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        rotation: -2,
        duration: 0.7,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    // Animate process steps with connecting line
    const processLine = document.querySelector(".process-line");
    if (processLine) {
      gsap.from(processLine, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".process-diagram",
          start: "top 70%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    }

    // Animate badge elements
    gsap.utils.toArray(".badge").forEach((badge) => {
      gsap.from(badge, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: badge,
          start: "top 85%",
        },
      });
    });
  }

  // Initialize scroll animations
  if (window.gsap && window.ScrollTrigger) {
    initScrollAnimations();
  }
  // Enhanced Canvas-based Swarm Animation
  class SwarmAnimation {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouse = {
        x: 0,
        y: 0,
        isActive: false,
        radius: 100
      };
      this.connectionDistance = 80;
      this.maxConnections = 5;
      this.animationId = null;
      this.isVisible = false;
      
      // Performance settings based on device
      this.particleCount = this.getParticleCount();
      this.qualityLevel = this.getQualityLevel();
      
      this.init();
      this.setupIntersectionObserver();
      this.addEventListeners();
      this.resizeCanvas();
      this.animate();
    }

    getParticleCount() {
      const width = window.innerWidth;
      if (width < 480) return 25;      // Mobile
      if (width < 768) return 35;      // Small tablets
      if (width < 1024) return 45;     // Tablets
      return 60;                       // Desktop
    }

    getQualityLevel() {
      // Detect device performance capability
      const ua = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isLowEnd = isMobile || window.devicePixelRatio < 2;
      
      return {
        glowEffect: !isLowEnd,
        shadowBlur: isLowEnd ? 5 : 15,
        particleGlow: isLowEnd ? 2 : 8,
        connectionGlow: isLowEnd ? 1 : 3
      };
    }

    init() {
      this.particles = [];
      
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(this.createParticle());
      }
    }

    createParticle() {
      const margin = 50;
      return {
        x: margin + Math.random() * (this.canvas.width - margin * 2),
        y: margin + Math.random() * (this.canvas.height - margin * 2),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        originalVx: (Math.random() - 0.5) * 0.5,
        originalVy: (Math.random() - 0.5) * 0.5,
        radius: 1.5 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4,
        connectionCount: 0,
        energy: Math.random(), // For pulsing effect
        phase: Math.random() * Math.PI * 2 // For wave motion
      };
    }

    setupIntersectionObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      
      observer.observe(this.canvas);
    }

    addEventListeners() {
      // Mouse/touch events
      const updateMouse = (clientX, clientY) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = clientX - rect.left;
        this.mouse.y = clientY - rect.top;
        this.mouse.isActive = true;
      };

      this.canvas.addEventListener('mousemove', (e) => {
        updateMouse(e.clientX, e.clientY);
      });

      this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        updateMouse(touch.clientX, touch.clientY);
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.isActive = false;
      });

      this.canvas.addEventListener('touchend', () => {
        this.mouse.isActive = false;
      });

      // Resize handler
      window.addEventListener('resize', () => {
        this.handleResize();
      });

      // Visibility change handler for performance
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
          }
        } else if (!this.animationId) {
          this.animate();
        }
      });
    }

    handleResize() {
      // Debounce resize events
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
        this.particleCount = this.getParticleCount();
        this.qualityLevel = this.getQualityLevel();
        
        // Adjust particle count if needed
        if (this.particles.length < this.particleCount) {
          while (this.particles.length < this.particleCount) {
            this.particles.push(this.createParticle());
          }
        } else if (this.particles.length > this.particleCount) {
          this.particles = this.particles.slice(0, this.particleCount);
        }
      }, 150);
    }

    resizeCanvas() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      
      this.ctx.scale(dpr, dpr);
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
    }

    updateParticles(deltaTime) {
      const time = Date.now() * 0.001;
      
      this.particles.forEach((particle, index) => {
        // Reset connection count
        particle.connectionCount = 0;
        
        // Update energy for pulsing effect
        particle.energy = 0.5 + 0.5 * Math.sin(time * 2 + particle.phase);
        
        // Natural wave motion
        const waveInfluence = 0.1;
        particle.vx = particle.originalVx + Math.sin(time + particle.phase) * waveInfluence;
        particle.vy = particle.originalVy + Math.cos(time * 0.8 + particle.phase) * waveInfluence;
        
        // Mouse interaction with intelligent behavior
        if (this.mouse.isActive) {
          const dx = this.mouse.x - particle.x;
          const dy = this.mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.mouse.radius) {
            const force = (this.mouse.radius - distance) / this.mouse.radius;
            const angle = Math.atan2(dy, dx);
            
            // Attraction behavior with some particles, repulsion with others
            const behavior = (index % 3 === 0) ? -1 : 1; // 1/3 repel, 2/3 attract
            const intensity = force * behavior * 0.02;
            
            particle.vx += Math.cos(angle) * intensity;
            particle.vy += Math.sin(angle) * intensity;
          }
        }
        
        // Flocking behavior - separation, alignment, cohesion
        let separationX = 0, separationY = 0;
        let alignmentX = 0, alignmentY = 0;
        let cohesionX = 0, cohesionY = 0;
        let neighbors = 0;
        
        this.particles.forEach((other, otherIndex) => {
          if (index === otherIndex) return;
          
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 60) { // Neighbor radius
            neighbors++;
            
            // Separation (avoid crowding)
            if (distance < 30) {
              separationX -= dx / distance;
              separationY -= dy / distance;
            }
            
            // Alignment (steer towards average heading)
            alignmentX += other.vx;
            alignmentY += other.vy;
            
            // Cohesion (steer towards average position)
            cohesionX += other.x;
            cohesionY += other.y;
          }
        });
        
        if (neighbors > 0) {
          // Apply flocking forces
          particle.vx += separationX * 0.01;
          particle.vy += separationY * 0.01;
          
          alignmentX /= neighbors;
          alignmentY /= neighbors;
          particle.vx += (alignmentX - particle.vx) * 0.005;
          particle.vy += (alignmentY - particle.vy) * 0.005;
          
          cohesionX /= neighbors;
          cohesionY /= neighbors;
          particle.vx += (cohesionX - particle.x) * 0.001;
          particle.vy += (cohesionY - particle.y) * 0.001;
        }
        
        // Velocity damping and limits
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const maxSpeed = 1.5;
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary handling with smooth wrapping
        const margin = 20;
        if (particle.x < -margin) particle.x = this.canvas.width / (window.devicePixelRatio || 1) + margin;
        if (particle.x > this.canvas.width / (window.devicePixelRatio || 1) + margin) particle.x = -margin;
        if (particle.y < -margin) particle.y = this.canvas.height / (window.devicePixelRatio || 1) + margin;
        if (particle.y > this.canvas.height / (window.devicePixelRatio || 1) + margin) particle.y = -margin;
      });
    }

    drawConnections() {
      this.ctx.strokeStyle = '#FFD700';
      this.ctx.lineWidth = 0.5;
      
      for (let i = 0; i < this.particles.length; i++) {
        const particle = this.particles[i];
        
        if (particle.connectionCount >= this.maxConnections) continue;
        
        for (let j = i + 1; j < this.particles.length; j++) {
          const other = this.particles[j];
          
          if (other.connectionCount >= this.maxConnections) continue;
          
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.connectionDistance) {
            const opacity = (1 - distance / this.connectionDistance) * 0.3;
            
            if (this.qualityLevel.glowEffect) {
              this.ctx.shadowColor = '#FFD700';
              this.ctx.shadowBlur = this.qualityLevel.connectionGlow;
            }
            
            this.ctx.globalAlpha = opacity;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.stroke();
            
            particle.connectionCount++;
            other.connectionCount++;
          }
        }
      }
      
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    }

    drawParticles() {
      this.particles.forEach(particle => {
        const size = particle.radius * (0.8 + particle.energy * 0.4);
        const alpha = particle.opacity * (0.7 + particle.energy * 0.3);
        
        if (this.qualityLevel.glowEffect) {
          this.ctx.shadowColor = '#FFD700';
          this.ctx.shadowBlur = this.qualityLevel.particleGlow;
        }
        
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        this.ctx.fill();
      });
      
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    }

    animate() {
      if (!this.isVisible) {
        this.animationId = requestAnimationFrame(() => this.animate());
        return;
      }
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw
      this.updateParticles();
      this.drawConnections();
      this.drawParticles();
      
      this.animationId = requestAnimationFrame(() => this.animate());
    }    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
      window.removeEventListener('resize', this.handleResize);
    }
  }

  // Movement Banner and Core Values Animations
  function initAboutSectionAnimations() {
    // Animate movement banner
    gsap.from(".movement-banner", {
      scrollTrigger: {
        trigger: ".movement-banner",
        start: "top bottom-=100px",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate core value cards with stagger
    gsap.from(".value-card", {
      scrollTrigger: {
        trigger: ".core-values",
        start: "top bottom-=100px",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });

    // Animate core value icons
    gsap.to(".value-card i", {
      scrollTrigger: {
        trigger: ".core-values",
        start: "top bottom-=100px",
        toggleActions: "play none none reverse",
      },
      duration: 1,
      scale: 1.1,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
      stagger: {
        each: 0.2,
        from: "random",
      },
    });
  }

  // Core Values Animations with hover effects
  function initCoreValuesAnimations() {
    // Subtle icon hover animation
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        const icon = card.querySelector('i');
        if (!icon) return;

        card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                y: -4,
                scale: 1.1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
  }

  // Initialize all animations on DOM load
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize swarm animation
    const swarmCanvas = document.querySelector('#swarm-canvas');
    if (swarmCanvas) {
      new SwarmAnimation(swarmCanvas);
    }
    
    // Initialize about section animations
    initAboutSectionAnimations();
    
    // Initialize core values animations
    initCoreValuesAnimations();
  });
