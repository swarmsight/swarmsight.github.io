// Enhanced animations and effects for SwarmSight landing page
document.addEventListener("DOMContentLoaded", function () {
  // Initialize ScrollTrigger
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

  // Enhanced Canvas-based Swarm Animation
  class SwarmAnimation {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this.mouse = {
        x: 0,
        y: 0,
        isActive: false,
        radius: 100,
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
      if (width < 480) return 25; // Mobile
      if (width < 768) return 35; // Small tablets
      if (width < 1024) return 45; // Tablets
      return 60; // Desktop
    }

    getQualityLevel() {
      // Detect device performance capability
      const ua = navigator.userAgent;
      const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isLowEnd = isMobile || window.devicePixelRatio < 2;

      return {
        glowEffect: !isLowEnd,
        shadowBlur: isLowEnd ? 5 : 15,
        particleGlow: isLowEnd ? 2 : 8,
        connectionGlow: isLowEnd ? 1 : 3,
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
        phase: Math.random() * Math.PI * 2, // For wave motion
      };
    }

    setupIntersectionObserver() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.1 }
      );

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

      this.canvas.addEventListener("mousemove", (e) => {
        updateMouse(e.clientX, e.clientY);
      });

      this.canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        updateMouse(touch.clientX, touch.clientY);
      });

      this.canvas.addEventListener("mouseleave", () => {
        this.mouse.isActive = false;
      });

      this.canvas.addEventListener("touchend", () => {
        this.mouse.isActive = false;
      });

      // Resize handler
      window.addEventListener("resize", () => {
        this.handleResize();
      });

      // Visibility change handler for performance
      document.addEventListener("visibilitychange", () => {
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
      this.canvas.style.width = rect.width + "px";
      this.canvas.style.height = rect.height + "px";
    }

    updateParticles() {
      const time = Date.now() * 0.001;

      this.particles.forEach((particle, index) => {
        // Reset connection count
        particle.connectionCount = 0;

        // Update energy for pulsing effect
        particle.energy = 0.5 + 0.5 * Math.sin(time * 2 + particle.phase);

        // Natural wave motion
        const waveInfluence = 0.1;
        particle.vx =
          particle.originalVx + Math.sin(time + particle.phase) * waveInfluence;
        particle.vy =
          particle.originalVy +
          Math.cos(time * 0.8 + particle.phase) * waveInfluence;

        // Mouse interaction with intelligent behavior
        if (this.mouse.isActive) {
          const dx = this.mouse.x - particle.x;
          const dy = this.mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.mouse.radius) {
            const force = (this.mouse.radius - distance) / this.mouse.radius;
            const angle = Math.atan2(dy, dx);

            // Attraction behavior with some particles, repulsion with others
            const behavior = index % 3 === 0 ? -1 : 1; // 1/3 repel, 2/3 attract
            const intensity = force * behavior * 0.02;

            particle.vx += Math.cos(angle) * intensity;
            particle.vy += Math.sin(angle) * intensity;
          }
        }

        // Flocking behavior - separation, alignment, cohesion
        let separationX = 0,
          separationY = 0;
        let alignmentX = 0,
          alignmentY = 0;
        let cohesionX = 0,
          cohesionY = 0;
        let neighbors = 0;

        this.particles.forEach((other, otherIndex) => {
          if (index === otherIndex) return;

          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 60) {
            // Neighbor radius
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

        const speed = Math.sqrt(
          particle.vx * particle.vx + particle.vy * particle.vy
        );
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
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight =
          this.canvas.height / (window.devicePixelRatio || 1);

        if (particle.x < -margin) particle.x = canvasWidth + margin;
        if (particle.x > canvasWidth + margin) particle.x = -margin;
        if (particle.y < -margin) particle.y = canvasHeight + margin;
        if (particle.y > canvasHeight + margin) particle.y = -margin;
      });
    }

    drawConnections() {
      this.ctx.strokeStyle = "#FFD700";
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
              this.ctx.shadowColor = "#FFD700";
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
      this.particles.forEach((particle) => {
        const size = particle.radius * (0.8 + particle.energy * 0.4);
        const alpha = particle.opacity * (0.7 + particle.energy * 0.3);

        if (this.qualityLevel.glowEffect) {
          this.ctx.shadowColor = "#FFD700";
          this.ctx.shadowBlur = this.qualityLevel.particleGlow;
        }

        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = "#FFD700";
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
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      window.removeEventListener("resize", this.handleResize);
    }
  }

  // Enhanced 3D Card Effect for Perspective Cards
  const perspectiveCards = document.querySelectorAll(".perspective-card");

  perspectiveCards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / (rect.width / 2);
      const deltaY = (y - centerY) / (rect.height / 2);

      const rotateX = deltaY * -10;
      const rotateY = deltaX * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = "transform 0.1s";

      // Add highlight effect
      const highlight = `rgba(247, 233, 77, ${0.05 + Math.abs(deltaX) * 0.05})`;
      card.style.background = `linear-gradient(to bottom right, rgba(20, 20, 20, 0.8), ${highlight})`;
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.5s, background 0.5s";
      card.style.background = "";
    });
  });
  // Movement Banner and Core Values Animations
  function initAboutSectionAnimations() {
    // Animate movement banner
    gsap.from(".movement-banner", {
      scrollTrigger: {
        trigger: ".movement-banner",
        start: "top bottom-=100px",
        toggleActions: "play none none none",
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
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }

  // Core Values Animations with hover effects
  function initCoreValuesAnimations() {
    const valueCards = document.querySelectorAll(".value-card");
    valueCards.forEach((card) => {
      const icon = card.querySelector("i");
      if (!icon) return;

      card.addEventListener("mouseenter", () => {
        gsap.to(icon, {
          y: -4,
          scale: 1.1,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(icon, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
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

  // Initialize all animations
  function initAnimations() {
    // Initialize swarm animation
    const swarmCanvas = document.querySelector("#swarm-canvas");
    if (swarmCanvas) {
      new SwarmAnimation(swarmCanvas);
    }

    // Initialize other animations
    initAboutSectionAnimations();
    initCoreValuesAnimations();
  }

  // Start animations when DOM is ready
  initAnimations();
});
