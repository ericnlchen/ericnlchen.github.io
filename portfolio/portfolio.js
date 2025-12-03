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

// // Category label stuff
// const categoryLabel = document.getElementsByClassName("category-label")[0];
// categoryLabel.style.opacity = 1;
// const trigger = document.getElementsByClassName("research-projects")[0];

// const observer1 = new IntersectionObserver(
//   (entries) => {
//     const entry = entries[0];

//     if (entry.isIntersecting) {
//       // Trigger reached → fade in
//       categoryLabel.style.opacity = 1;
//     } else {
//       // Trigger left viewport → fade out
//       categoryLabel.style.opacity = 0;
//     }
//   },
//   {
//     root: null,          // viewport
//     threshold: 0.2       // adjust: 0.0 = as soon as it touches, 1.0 = fully visible
//   }
// );

// observer1.observe(trigger);

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