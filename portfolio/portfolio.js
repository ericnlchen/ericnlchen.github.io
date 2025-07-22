// Ensure that L-ink video loads first

// Resize slides
const sectionContainer = document.getElementsByClassName("slide-container")[0];
const viewportWidth = window.innerWidth;
let sections = document.getElementsByTagName("section");
const sectionWidth = sections[0].offsetWidth;
if (sectionWidth > viewportWidth) {
  const scaleFactor = (0.8 * viewportWidth) / sectionWidth;
  sectionContainer.style.zoom = scaleFactor;
}

// Add page numbers
let pageNum = 0;
for (const section of sections) {
  const pageNumElement = document.createElement("div");
  pageNumElement.setAttribute("class", "page-num");
  pageNumElement.innerHTML = `${pageNum}`;
  section.appendChild(pageNumElement);
  pageNum++;
}

// Add indicators for new projects
for (const section of sections) {
  if (section.classList.contains("proj-title")) {
    const bar = document.createElement("div");
    bar.setAttribute("background-color", "black");
    bar.setAttribute("height", "20px");
    bar.setAttribute("width", "1000px");
    section.appendChild(bar);
  }
}
