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
    const scaleFactor = (0.8 * viewportWidth) / sectionWidth;

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

// // Add indicators for new projects
// for (const section of sections) {
//   if (section.classList.contains("proj-title")) {
//     const bar = document.createElement("div");
//     bar.setAttribute("background-color", "black");
//     bar.setAttribute("height", "20px");
//     bar.setAttribute("width", "1000px");
//     section.appendChild(bar);
//   }
// }
