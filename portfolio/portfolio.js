import { curlNoise } from "../scripts/curlNoise.js";

// Ensure that L-ink video loads first
const sectionContainer = document.getElementsByClassName("slide-container")[0];
let sections = document.getElementsByTagName("section");
const outer = document.getElementsByClassName("outer")[0];
const sectionHeight = 1080; // px
const sectionVerticalMargin = 30; // px

// Add page numbers
let pageNum = 0;
for (const section of sections) {
  const pageNumElement = document.createElement("div");
  pageNumElement.setAttribute("class", "page-num");
  pageNumElement.innerHTML = `${pageNum}`;
  section.appendChild(pageNumElement);
  pageNum++;
}

// Resize slides
const resizeSlides = () => {
  const viewportWidth = window.innerWidth;
  const sectionWidth = sections[0].offsetWidth;
  if (sectionWidth > viewportWidth) {
    const scaleFactor = (0.75 * viewportWidth) / sectionWidth;

    sectionContainer.style.transform = `scale(${scaleFactor})`;

    sectionContainer.style.height = `${
      (sectionHeight + sectionVerticalMargin) * sections.length
    }px`;

    outer.style.height = `${
      (sectionHeight + sectionVerticalMargin) * sections.length * scaleFactor
    }px`;
  }
};

resizeSlides();

window.addEventListener("resize", () => {
  resizeSlides();
});

// Video loading stuff
const options = {
  root: null, // viewport
  rootMargin: "200px",
  threshold: 0.25,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;

    if (entry.isIntersecting) {
      if (!video.src) {
        video.src = video.dataset.src;
        video.load();
      }

      video.play().catch((err) => {
        console.warn("Autoplay failed", err);
      });
    } else {
      video.pause();
    }
  });
}, options);

// Observe each video
document
  .querySelectorAll(".lazy-video")
  .forEach((video) => observer.observe(video));

// Category headers logic
const categories = document.querySelectorAll(".category");
const categoryLabel = document.getElementById("category-label");
let activeCategory = null;
function fadeCategoryLabelTo(newLabel) {
  if (categoryLabel.textContent === newLabel) return;
  categoryLabel.classList.add('is-fading-out');
  const handleTransitionEnd = (e) => {
    if (e.propertyName !== 'opacity') return;
    categoryLabel.textContent = newLabel;
    categoryLabel.classList.remove('is-fading-out');
    categoryLabel.removeEventListener('transitionend', handleTransitionEnd);
  };
  categoryLabel.addEventListener('transitionend', handleTransitionEnd);
}

function fadeBackgroundTo(color) {
  document.body.style.backgroundColor = color;
}

const categoryObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.rootBounds) continue;
    const visibleHeight = entry.intersectionRect.height;
    const viewportHeight = entry.rootBounds.height;
    const viewportFraction = visibleHeight / viewportHeight;
    entry.target.dataset.viewportFraction = viewportFraction;
  }
  let bestCategory = null;
  let bestFraction = 0;

  for (const category of categories) {
    const f = parseFloat(category.dataset.viewportFraction || '0');
    if (f > bestFraction) {
      bestFraction = f;
      bestCategory = category;
    }
  }

  switch(bestCategory.id) {
    case "research-projects":
      fadeCategoryLabelTo("RESEARCH");
      break;
    case "course-projects":
      fadeCategoryLabelTo("PROJECTS");
      break;
    case "art-projects":
      fadeCategoryLabelTo("ART");
      break;
    default:
      fadeCategoryLabelTo("");
      break;
  }
}, {
  root: null,
  threshold: Array.from({ length: 21 }, (_, i) => i / 20) // 0, .05, .10, ..., 1.0
});

categories.forEach(category => categoryObserver.observe(category));






// Particle system
let particlesVisible = false;

function createCircle(cx, cy, r) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', String(cx));
  circle.setAttribute('cy', String(cy));
  circle.setAttribute('r', String(r));
  circle.setAttribute('fill-opacity', '1');
  circle.setAttribute('fill', '#cf1a14')
  // Set css blend mode of the circle
  // circle.setAttribute('style', 'mix-blend-mode: plus-lighter;');
  return circle;
}

// Get all sliders
const particleSizeSlider = document.getElementById("particle-size-slider");
const particleSpeedSlider = document.getElementById("particle-speed-slider");
const gravitySlider = document.getElementById("gravity-slider");
const turbulenceSlider = document.getElementById("turbulence-slider");
const spreadSlider = document.getElementById("spread-slider");

function particleSystem(root, pos, noise=false) {
    const particlesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    particlesGroup.setAttribute("isolation", "isolate");
    root.appendChild(particlesGroup);

    let particles = [];

    // Anim loop
    let rafId = null;
    let lastTime = 0;
    function update(dt) {
        const fadeRate = 0.005 * 60;
        const particlesNew = [];
        for (const particle of particles) {
            let turbulence = curlNoise(particle.x, particle.y, Date.now());
            turbulence = [
              turbulence[0] * Number(turbulenceSlider.value),
              turbulence[1] * Number(turbulenceSlider.value)
            ]
            let accel = [
              0,
              Number(gravitySlider.value)
            ];
            particle.vx += accel[0] * dt;
            particle.vy += accel[1] * dt;
            particle.x += (particle.vx + turbulence[0]) * dt;
            particle.y += (particle.vy + turbulence[1]) * dt;
            particle.node.cx.baseVal.value = particle.x;
            particle.node.cy.baseVal.value = particle.y;

            // const r = particle.node.r.baseVal.value - shrinkRate * dt;
            const opacity = particle.node.getAttribute('fill-opacity') - fadeRate * dt;
            // particle.node.r.baseVal.value = r;
            particle.node.setAttribute('fill-opacity', opacity);
            if (opacity > 0) {
                particlesNew.push(particle);
            }
            else {
                particle.node.remove();
            }
        }
        particles = particlesNew;
    }

    function spawn() {
      const particleSize = Number(particleSizeSlider.value);
      const particle = createParticle(particleSize);
      if (particle) {
          particles.push(particle);
      }
    }

    setInterval(() => {
      if (particlesVisible) spawn();
    }, 100);

    function frame(ts) {
        if (!lastTime) lastTime = ts;
        let dt = (ts - lastTime) / 1000; // seconds
        lastTime = ts;
        update(dt);
        rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    function createParticle(radius) {
        const circle = createCircle(pos.x, pos.y, radius);
        particlesGroup.appendChild(circle);
        // const animateFill = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        // animateFill.setAttribute("attributeName", "fill");
        // animateFill.setAttribute("from", "#aa5500ff");
        // animateFill.setAttribute("to", "#1b1111dd");
        // animateFill.setAttribute("begin", "indefinite")
        // animateFill.setAttribute("dur", "0.4s");
        // animateFill.setAttribute("repeatCount", "1");
        // animateFill.setAttribute("fill", "freeze");
        // circle.appendChild(animateFill);
        // animateFill.beginElement();

        const startSpeed = particleSpeedSlider.value;
        const maxAngle = spreadSlider.value;
        const angle = (Math.random() - 0.5) * maxAngle;
        const vx = Math.sin((Math.PI / 180) * angle) * startSpeed;
        const vy = -Math.cos((Math.PI / 180) * angle) * startSpeed;

        const particle = {
            node: circle,
            x: pos.x + 15 * (Math.random() - 0.5),
            y: pos.y,
            vx: vx,
            vy: vy
        }
        return particle
    }
}

const particleContainer = document.getElementById("particle-container");
particleSystem(particleContainer, {x: 1240, y: 900});


// Only spawn particles when the container is visible
const particleSystemObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        particlesVisible = true;
      }
      else {
        particlesVisible = false;
      }
    })
  },
  {
    root: null,
    threshold: [0, 0.3, 1]
  }
)

particleSystemObserver.observe(particleContainer);