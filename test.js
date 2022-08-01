"use strict";

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  frameRate(30);
  stroke(255, 0, 0);
  /// JUST FOR FUN ///
  let a = (mouseX / width) * 180;
  let theta = radians(a);
  ////////////////////
  translate(width / 3, height / 2);

  let axiom = "F";
  let rules = {
    F: "F+G",
    G: "F-G",
  };
  let iters = 11;

  let Lstring = Lsystem(0, axiom, rules, iters);
  console.log(Lstring);
  draw_Lsystem(Lstring, theta);
}

function Lsystem(alphabet, axiom, rules, iters) {
  // validate input
  let i = 0;
  while (i < iters) {
    axiom = grow(axiom, rules);
    i++;
  }
  return axiom;
}

function grow(axiom, rules) {
  // assuming input has been validated
  let new_axiom = "";
  for (var j = 0; j < axiom.length; j++) {
    if (rules[axiom[j]] === undefined) new_axiom += axiom[j];
    else new_axiom += rules[axiom[j]];
  }
  return new_axiom;
}

function draw_Lsystem(Lstring, theta) {
  let l = 5;
  for (var i = 0; i < Lstring.length; i++) {
    if (Lstring[i] == "F" || Lstring[i] == "G") {
      line(0, 0, 0, -l);
      translate(0, -l);
    } else if (Lstring[i] == "+") {
      rotate(theta);
    } else if (Lstring[i] == "-") {
      rotate(-theta);
    }
  }
}
