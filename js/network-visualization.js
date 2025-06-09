// Network Visualization
document.addEventListener("DOMContentLoaded", function () {
  const networkViz = document.getElementById("network-viz");
  const canvas = document.getElementById("network-connections");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  function resizeCanvas() {
    canvas.width = networkViz.offsetWidth;
    canvas.height = networkViz.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Node positions
  const nodes = {
    primary: { x: canvas.width / 2, y: canvas.height / 2 },
    secondary: [
      { x: canvas.width * 0.3, y: canvas.height * 0.3 },
      { x: canvas.width * 0.7, y: canvas.height * 0.7 },
    ],
    tertiary: [
      { x: canvas.width * 0.2, y: canvas.height * 0.6 },
      { x: canvas.width * 0.8, y: canvas.height * 0.4 },
      { x: canvas.width * 0.5, y: canvas.height * 0.8 },
    ],
  };

  // Animation variables
  let time = 0;
  const connectionOpacity = 0.3;

  // Draw connections
  function drawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections from primary to secondary nodes
    nodes.secondary.forEach((node) => {
      const gradient = ctx.createLinearGradient(
        nodes.primary.x,
        nodes.primary.y,
        node.x,
        node.y
      );
      gradient.addColorStop(0, "rgba(242, 213, 2, " + connectionOpacity + ")");
      gradient.addColorStop(1, "rgba(242, 213, 2, 0)");

      ctx.beginPath();
      ctx.moveTo(nodes.primary.x, nodes.primary.y);
      ctx.lineTo(node.x, node.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw connections from secondary to tertiary nodes
    nodes.secondary.forEach((secNode, i) => {
      nodes.tertiary.forEach((terNode) => {
        const gradient = ctx.createLinearGradient(
          secNode.x,
          secNode.y,
          terNode.x,
          terNode.y
        );
        gradient.addColorStop(
          0,
          "rgba(242, 213, 2, " + connectionOpacity * 0.7 + ")"
        );
        gradient.addColorStop(1, "rgba(242, 213, 2, 0)");

        ctx.beginPath();
        ctx.moveTo(secNode.x, secNode.y);
        ctx.lineTo(terNode.x, terNode.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    // Animate node positions
    nodes.secondary.forEach((node, i) => {
      node.x += Math.sin(time + i) * 0.5;
      node.y += Math.cos(time + i) * 0.5;
    });

    nodes.tertiary.forEach((node, i) => {
      node.x += Math.sin(time + i * 2) * 0.3;
      node.y += Math.cos(time + i * 2) * 0.3;
    });

    time += 0.02;
    requestAnimationFrame(drawConnections);
  }

  // Position nodes
  const primaryNode = document.querySelector(".primary-node");
  const secondaryNodes = document.querySelectorAll(".secondary-node");
  const tertiaryNodes = document.querySelectorAll(".tertiary-node");

  function positionNodes() {
    if (primaryNode) {
      primaryNode.style.left = nodes.primary.x - 20 + "px";
      primaryNode.style.top = nodes.primary.y - 20 + "px";
    }

    secondaryNodes.forEach((node, i) => {
      if (nodes.secondary[i]) {
        node.style.left = nodes.secondary[i].x - 12.5 + "px";
        node.style.top = nodes.secondary[i].y - 12.5 + "px";
      }
    });

    tertiaryNodes.forEach((node, i) => {
      if (nodes.tertiary[i]) {
        node.style.left = nodes.tertiary[i].x - 7.5 + "px";
        node.style.top = nodes.tertiary[i].y - 7.5 + "px";
      }
    });
  }

  // Initialize animation
  positionNodes();
  drawConnections();

  // Add scroll-triggered animations
  gsap.registerPlugin(ScrollTrigger);

  // Animate value cards
  gsap.utils.toArray(".value-card").forEach((card, i) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
        delay: i * 0.1,
      }
    );
  });

  // Animate feature items
  gsap.utils.toArray(".feature-item").forEach((item, i) => {
    gsap.fromTo(
      item,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
        },
        delay: i * 0.1,
      }
    );
  });

  // Animate quote
  gsap.fromTo(
    ".modern-quote",
    { opacity: 0, scale: 0.95 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".modern-quote",
        start: "top 80%",
      },
    }
  );
});
