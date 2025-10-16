export function createNode() {
  const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const nodeChildren = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  const nodePoly = createPolyline();
  node.appendChild(nodeChildren);
  node.appendChild(nodePoly);
  return node;
}

export function addPointToNode(node, newPoint) {
  const poly = node.querySelector(":scope > polyline");
  const points = poly.getAttribute("points");
  poly.setAttribute("points", `${points} ${newPoint.x},${newPoint.y}`);
}

function createPolyline() {
  let poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  poly.setAttribute("fill", "none");
  poly.setAttribute("stroke", "#0eab00");
  poly.setAttribute("stroke-width", "2");
  poly.setAttribute("points", ``);
  poly.setAttribute("stroke-linecap", "round");
  poly.setAttribute("stroke-linejoin", "round");
  poly.setAttribute("stroke-opacity", "100%");
  return poly;
}

export function addChildNode(parentNode, childNode) {
  const children = parentNode.querySelector(":scope > g");
  children.appendChild(childNode);
}

export function getAnimation() {
  let animate = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "animateTransform"
  );
  animate.setAttribute("attributeName", "transform");
  animate.setAttribute("type", "scale");
  animate.setAttribute("from", "1");
  animate.setAttribute("to", "1.5");
  animate.setAttribute("dur", "1s");
  animate.setAttribute("repeatCount", "indefinite");
  return animate;
}
