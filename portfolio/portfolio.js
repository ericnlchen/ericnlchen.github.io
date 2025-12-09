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
