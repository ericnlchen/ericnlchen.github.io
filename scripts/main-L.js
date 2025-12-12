import { lString, indexOfClosingBrace } from "./lUtil.js";
import {
  createNode,
  addPointToNode,
  addChildNode,
  getAnimation,
} from "./svgUtil.js";

// For animation: Might need to give each branch a transform that translates it to its own origin
export function mainL() {
  const canvas = document.getElementById("background-canvas");
  const LInkHandle = document.getElementsByClassName("l-ink-handle")[0];

  let isDrawing = false;
  let currentStroke = null;
  let activeBranches = [];
  let branchStack = [];
  let lastPoint = null;
  let branchCounter = null;
  // Check if we support composite add for ephemeral anim (janky...)
  let supportsCompositeAdd = true;
  const ua = navigator.userAgent;
  const isSafari = ua.includes('Safari');
  const isChrome = ua.includes('Chrome') || ua.includes('CriOS');
  const isFirefox = ua.includes('Firefox') || ua.includes('FxiOS');
  const isEdge = ua.includes('Edg');
  const isOpera = ua.includes('OPR') || ua.includes('OPT');
  if (isSafari && !isChrome && !isFirefox && !isEdge && !isOpera) {
    supportsCompositeAdd = false;
  }
  console.log(`supportsCompositeAdd detected as: ${supportsCompositeAdd}`)

  // window.setInterval(() => {
  //   console.log(canvas.children.length)
  // }, 600)

  LInkHandle.addEventListener("pointerdown", (e) => {
    document.documentElement.style.cursor = "none";
    LInkHandle.style.cursor = "grabbing";
    isDrawing = true;
    activeBranches = [];
    branchCounter = 0;
    const newPoint = getMousePosition(e);
    lastPoint = newPoint;
    currentStroke = createBranch(0, newPoint, 0, true); // isTrunk=true
    // addPointToBranch(currentStroke, newPoint);
    canvas.appendChild(currentStroke.node);
    activeBranches.push(currentStroke);
  });

  document.addEventListener("pointermove", (e) => {
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

  document.addEventListener("pointerup", () => {
    if (!isDrawing) return;
    document.documentElement.style.cursor = "auto";
    LInkHandle.style.cursor = "grab";
    // Fade and remove
    if (currentStroke?.node) {
      const node = currentStroke.node;
      const anim = node.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 1000,
      });
      anim.finished.then(() => {
        node.remove();
      });
    }
    currentStroke = null;
    isDrawing = false;
  });

  // document.addEventListener("mouseout", (e) => {
  //   if (!e.relatedTarget) {
  //     console.log("leave")
  //     isDrawing = false;
  //   }
  // });

  /////////////////////////////////////////////
  function getMousePosition(evt) {
    const CTM = canvas.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  }

  function processBranch(branch, newPoint, alpha, dist) {
    // Iterate branch's L-string index, taking corresponding actions until reaching an F
    let symbol = lString[branch.lStringIndex];
    // While the current symbol is not an F
    while (symbol !== "F" && symbol !== undefined) {
      switch (symbol) {
        case "+":
          if (!branch.isTrunk) {
            branch.heading += 0.5; // rad
          }
          break;
        case "-":
          if (!branch.isTrunk) {
            branch.heading -= 0.5; // rad
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
          const branchIndex = activeBranches.findIndex(
            (b) => b.id === branch.id
          );
          activeBranches.splice(branchIndex, 1);
          branch.lStringIndex++;
          return;
      }
      branch.lStringIndex++;
      symbol = lString[branch.lStringIndex];
    }
    // Transform the point and add it to the branch
    const newPointTransf = transformToBranch(alpha, dist, branch);
    addPointToBranch(branch, newPointTransf);
    branch.lStringIndex++;
  }

  function createBranch(lStringIndex, point, heading = 0, isTrunk = false) {
    const node = createNode(); // creates a node that is structured as a branch
    const branch = {
      id: branchCounter,
      node: node,
      lStringIndex: lStringIndex,
      heading: heading,
      lastPoint: null,
      id: branchCounter,
      isTrunk: isTrunk,
      originPoint: point,
    };
    branchCounter++;

    // Add the branch's translation transform based on the point
    node.setAttribute("transform", `translate(${point.x} ${point.y})`);

    // Add pre-transformed point to branch
    addPointToBranch(branch, { x: 0, y: 0 });
    // node.classList.add('segment-pop')
    // const poly = node.querySelector(":scope > polyline");
    // poly.appendChild(getAnimation());
    if (!supportsCompositeAdd) {
      const children = node.querySelector(":scope > g");
      const anim = children.animate(
        [{ transform: `scale(0.05)` }, { transform: `scale(1)` }],
        {
          duration: 300,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
    else {
      const anim = node.animate(
        [{ transform: `scale(0.05)` }, { transform: `scale(1)` }],
        {
          duration: 300,
          easing: "ease-out",
          fill: "forwards",
          composite: "add"
        }
      );
    }
    return branch;
  }

  function addPointToBranch(branch, newPoint) {
    // Adds a pre-transformed point to a branch which has a node (a <g>) as branch.node
    // newPoint = {
    //     x: newPoint.x - branch.originPoint.x,
    //     y: newPoint.y - branch.originPoint.y
    // };
    addPointToNode(branch.node, newPoint);
    branch.lastPoint = newPoint;
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
}
