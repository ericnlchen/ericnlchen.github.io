import { lString, indexOfClosingBrace } from "./lUtil.js";
import {
  createNode,
  addPointToNode,
  addChildNode,
  getAnimation,
} from "./svgUtil.js";

// For animation: Might need to give each branch a transform that translates it to its own origin

const canvas = document.getElementById("background-canvas");

let isDrawing = false;
let currentBranch = null;
let activeBranches = [];
let branchStack = [];
let lastPoint = null;
let branchCounter = null;

// window.setInterval(() => {
//   for (let i = 0; i < lifeSpans.length; i++) {
//     lifeSpans[i] -= 1;
//   }
//   if (lifeSpans[0] <= 0) {
//     const pointsArr = currentPolyline.getAttribute("points").trim().split(" ");
//     const pointsTail = pointsArr.slice(1).join(" ");
//     currentPolyline.setAttribute("points", pointsTail);
//     lifeSpans = lifeSpans.slice(1);
//   }
// }, 4);

window.addEventListener("mousedown", (e) => {
  isDrawing = true;
  activeBranches = [];
  branchCounter = 0;
  const newPoint = getMousePosition(e);
  lastPoint = newPoint;
  currentBranch = createBranch(0, newPoint, 0, true); // isTrunk=true
  addPointToBranch(currentBranch, newPoint);
  canvas.appendChild(currentBranch.node);
  activeBranches.push(currentBranch);
});

window.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    const newPoint = getMousePosition(e);
    const dist = computeDistance(lastPoint, newPoint);
    if (dist < 4) {
      return;
    }
    const alpha = computeAngle(lastPoint, newPoint);
    lastPoint = newPoint;
    branchStack = [...activeBranches];
    // While there are branches on the stack
    while (branchStack.length > 0) {
      // Process the branch
      const branch = branchStack.pop();
      processBranch(branch, newPoint, alpha, dist);
    }
  }
});

window.addEventListener("mouseup", () => {
  isDrawing = false;
});

window.addEventListener("mouseleave", () => {
  isDrawing = false;
});

/////////////////////////////////////////////

function processBranch(branch, newPoint, alpha, dist) {
  // Iterate branch's L-string index, taking corresponding actions until reaching an F
  let symbol = lString[branch.lStringIndex];
  // While the current symbol is not an F
  while (symbol !== "F" && symbol !== undefined) {
    switch (symbol) {
      case "+":
        if (!branch.isTrunk) {
          branch.heading += 0.4; // rad
        }
        break;
      case "-":
        if (!branch.isTrunk) {
          branch.heading -= 0.4; // rad
        }
        break;
      case "[":
        // Add child branch
        const childBranch = createBranch(
          branch.lStringIndex + 1,
          branch.lastPoint,
          branch.heading
        );
        addChildNode(branch.node, childBranch.node);
        // Move parent lStringIndex to closing brace
        try {
          branch.lStringIndex = indexOfClosingBrace(
            lString,
            branch.lStringIndex
          );
        } catch (err) {
          console.error(err);
        }
        // Add new branch to active branches and processing stack
        activeBranches.push(childBranch);
        branchStack.push(childBranch);
        break;
      case "]":
        // remove from active branches
        const branchIndex = activeBranches.findIndex((b) => b.id === branch.id);
        activeBranches.splice(branchIndex, 1);
        branch.lStringIndex++;
        return;
    }
    branch.lStringIndex++;
    symbol = lString[branch.lStringIndex];
  }
  const newPointTransf = transformToBranch(alpha, dist, branch);
  addPointToBranch(branch, newPointTransf);
  branch.lStringIndex++;
}

function createBranch(lStringIndex, point, heading = 0, isTrunk = false) {
  const node = createNode();
  const branch = {
    node: node,
    lStringIndex: lStringIndex,
    heading: heading,
    lastPoint: null,
    id: branchCounter,
    isTrunk: isTrunk,
  };
  branchCounter++;
  addPointToBranch(branch, point);
  const poly = node.querySelector(":scope > polyline");
  // poly.appendChild(getAnimation());
  return branch;
}

function addPointToBranch(branch, newPoint) {
  addPointToNode(branch.node, newPoint);
  branch.lastPoint = newPoint;
}

function getMousePosition(evt) {
  const CTM = canvas.getScreenCTM();
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d,
  };
}

function transformToBranch(alpha, dist, branch) {
  const lastPoint = branch.lastPoint;
  const angle = alpha - Math.PI + branch.heading;
  const dx = dist * -Math.sin(angle);
  const dy = dist * Math.cos(angle);
  const newPointTransf = { x: lastPoint.x + dx, y: lastPoint.y + dy };
  return newPointTransf;
}

function computeAngle(lastPoint, newPoint) {
  const dx = newPoint.x - lastPoint.x;
  const dy = newPoint.y - lastPoint.y;
  const alpha = Math.atan2(dx, -dy);
  return alpha;
}

function computeDistance(lastPoint, newPoint) {
  const dx = newPoint.x - lastPoint.x;
  const dy = newPoint.y - lastPoint.y;
  return Math.sqrt(dx * dx + dy * dy);
}
