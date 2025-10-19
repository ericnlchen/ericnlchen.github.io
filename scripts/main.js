import { mainL } from "./main-L.js";
import { mainP } from "./main-P.js";

const dragHandles = document.querySelectorAll('.drag-handle');
for (const dh of dragHandles) {
  dh.addEventListener('contextmenu', (e) => e.preventDefault()); // blocks long-press menu
}

mainL();
mainP();