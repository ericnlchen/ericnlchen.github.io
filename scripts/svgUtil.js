export function createCircle(cx, cy, r = 20) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', String(cx));
  circle.setAttribute('cy', String(cy));
  circle.setAttribute('r', String(r));
  circle.setAttribute('fill-opacity', '1');
  // Set css blend mode of the circle
  circle.setAttribute('style', 'mix-blend-mode: plus-lighter;');
  return circle;
}

export function createNode() {
  // Creates a node structured as a branch <g>
  const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
  // Add a group to hold child nodes
  const nodeChildren = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  // Add a polyline
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
