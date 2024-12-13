// Resize slides
const sectionContainer = document.getElementsByClassName('slide-container')[0];
const viewportWidth = window.innerWidth;
let sections = document.getElementsByTagName('section');
const sectionWidth = sections[0].offsetWidth;
if (sectionWidth > viewportWidth) {
    const scaleFactor = 0.9*viewportWidth / sectionWidth;
    sectionContainer.style.zoom = scaleFactor;
}