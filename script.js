const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
const media = window.matchMedia("(prefers-reduced-motion: reduce)");
let points = [];
let animationFrame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(34, Math.min(88, Math.floor(window.innerWidth / 18)));
  points = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    r: Math.random() * 1.6 + 0.6,
  }));
}

function drawField() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const point of points) {
    if (!media.matches) {
      point.x += point.vx;
      point.y += point.vy;
    }

    if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > window.innerHeight) point.vy *= -1;

    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(92, 225, 230, 0.7)";
    ctx.fill();
  }

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 135) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(92, 225, 230, ${0.17 * (1 - distance / 135)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  animationFrame = requestAnimationFrame(drawField);
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const link = navLinks.find((item) => item.getAttribute("href") === `#${entry.target.id}`);
      navLinks.forEach((item) => item.classList.toggle("active", item === link));
    }
  },
  { rootMargin: "-45% 0px -50% 0px" },
);

sections.forEach((section) => observer.observe(section));
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawField();

window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
