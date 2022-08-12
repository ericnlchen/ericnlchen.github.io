"use strict";

const MAX_SIZE = 1000000;

function setup() {
    createCanvas(windowWidth/2, windowHeight/2);
    // Logic for adding a new rule with the plus button
    const plusBtn = document.getElementById("plus_button");
    plusBtn.addEventListener('click', () => {
        const rules_list = document.getElementById("rules_list");
        const last_item = rules_list.lastElementChild;
        const new_item = last_item.cloneNode(true); // create a clone of previous rule
        new_item.id = "rule";                       // all new rules have ID = "rule"
        // If new rule is a copy of the first rule, add a minus button and add event listener
        if (last_item.id === "rule_0") {
            const minusBtn = document.createElement('button');
            minusBtn.className = "minus round";
            minusBtn.innerHTML = "-";
            minusBtn.addEventListener('click', () => {
                minusBtn.parentElement.remove();
                redraw();
            })
            new_item.appendChild(minusBtn);
        }
        // If new rule is NOT a copy of the first rule, just add event listener to minus button
        else {
            const minusBtn = new_item.lastElementChild;
            minusBtn.addEventListener('click', () => {
                minusBtn.parentElement.remove();
                redraw();
            })
        }
        // We also need to add event listeners to the new input elements
        // ... And clear their values
        const input_elements = new_item.querySelectorAll("input");
        input_elements.forEach(
            function (currentValue) {
                currentValue.addEventListener('input', () => {
                    redraw();
                });
                currentValue.value = "";
            }
        );
        rules_list.appendChild(new_item);   // Append new rule to the DOM
        // TODO: rename "items" to "rules"
    });

    const input_elements = document.querySelectorAll("input");
    input_elements.forEach(
        function (currentValue) {
            currentValue.addEventListener('input', () => {
                redraw();
            })
        }
    );
    noLoop();
}

function draw() {
    console.log("Drawing now");
    background(255);
    frameRate(4);
    stroke(255, 0, 0);
    let theta = radians(90);
    translate(width / 3, height / 2);

    const axiom = document.getElementById("axiom").value;
    const rules = new Map();
    const rules_list = document.getElementById("rules_list");
    for (let i = 0; i < rules_list.children.length; i++) {
        const rule = rules_list.children[i];
        rules.set(rule.children[0].value, rule.children[1].value);
    }

    let iters = 10;

    let Lstring = Lsystem(0, axiom, rules, iters);
    draw_Lsystem(Lstring, theta);
}

function Lsystem(alphabet, axiom, rules, iters) {
    // TODO: validate input
    let i = 0;
    while (i < iters) {
        console.log(axiom.length);
        if (axiom.length > MAX_SIZE) {
            alert(`Max length exceeded at iteration ${i}!`);
            break;
        }
        axiom = grow(axiom, rules);
        i++;
    }
    return axiom;
}

function grow(axiom, rules) {
    // assuming input has been validated
    let new_axiom = "";
    for (let j = 0; j < axiom.length; j++) {
        if (rules.get(axiom[j]) === undefined) new_axiom += axiom[j];
        else new_axiom += rules.get(axiom[j]);
    }
    return new_axiom;
}

function draw_Lsystem(Lstring, theta) {
    let l = 5;
    for (let i = 0; i < Lstring.length; i++) {
        if (Lstring[i] == "F" || Lstring[i] == "G") { // Draw forward
            line(0, 0, 0, -l);
            translate(0, -l);
        } else if (Lstring[i] == "f" || Lstring[i] == "g") { // Move forward
            translate(0, -l);
        } else if (Lstring[i] == "L" || Lstring[i] == "+") {  // Left 90 deg
            rotate(radians(90));
        } else if (Lstring[i] == "R" || Lstring[i] == "-") { // Right 90 deg
            rotate(-radians(90));
        } else if (Lstring[i] == "l") { // Left 30 deg
            rotate(radians(30));
        } else if (Lstring[i] == "r") { // Right 30 deg
            rotate(-radians(30))
        } else if (Lstring[i] == "[") { // push
            push();
        } else if (Lstring[i] == "]") { // pop
            pop();
        }
    }
}
