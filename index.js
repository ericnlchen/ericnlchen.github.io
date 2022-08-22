"use strict";

const max_string_length = 100000;

function setup() {
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    // Ensure that the canvas display size and coordinate system size match
    const canvas = document.querySelector('.p5Canvas');
    canvas.setAttribute('width', CANVAS_WIDTH);
    canvas.setAttribute('height', CANVAS_HEIGHT);
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
    console.log("draw");
    background(255);
    frameRate(4);
    stroke(255, 0, 0);

    const axiom = document.getElementById("axiom").value;
    const rules = new Map();
    const rules_list = document.getElementById("rules_list");
    for (let i = 0; i < rules_list.children.length; i++) {
        const rule = rules_list.children[i];
        rules.set(rule.children[0].value, rule.children[1].value);
    }
    
    const iters_input = document.getElementById("iters_input");
    const iters = iters_input.value;
    let Lstring = Lsystem(0, axiom, rules, iters);
    show_Lsystem(Lstring);
}

function Lsystem(alphabet, axiom, rules, iters) {
    // TODO: validate input
    let i = 0;
    while (i < iters) {
        let old_axiom = axiom;
        axiom = grow(axiom, rules);
        // If we exceed the maximum length, we want to discard that iteration entirely and use only the previous axiom
        const iter_warning = document.getElementById("iter_warning");
        if (axiom.length > max_string_length) { 
            console.log(`Max string length exceeded at iteration ${i}`);
            const iters_input = document.getElementById("iters_input");
            iters_input.value = i;
            axiom = old_axiom; // revert to previous axiom
            iter_warning.textContent = `The string has grown too long! Cannot exceed ${i} iterations.`;
            break;
        }
        else {
            iter_warning.textContent = "";
        }
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

function show_Lsystem(Lstring) {
    // This function draws the Lsystem, resizes canvas to fit the whole drawing, and then redraws
    const [min_x, max_x, min_y, max_y] = draw_Lsystem(Lstring, 1, 0, 0); // draw once
    console.log(min_x, max_x, min_y, max_y);
    clear();
    // resizeCanvas(Math.abs(max_x - min_x), Math.abs(max_y - min_y), true); // resize

    const canvasWidth = width;
    const canvasHeight = height;
    const drawingWidth = Math.abs(max_x - min_x);
    const drawingHeight = Math.abs(max_y - min_y);

    const x_scale = canvasWidth / drawingWidth;
    const y_scale = canvasHeight / drawingHeight;
    const scale = Math.min(x_scale, y_scale);

    const x_offset = Math.abs(min_x);
    const y_offset = Math.abs(min_y);

    console.log(`og drawing width: ${drawingWidth}, og drawing height: ${drawingHeight}`);
    console.log(`scale: ${scale}`);
    console.log(`canvasWidth: ${canvasWidth}, canvasHeight: ${canvasHeight}`);


    draw_Lsystem(Lstring, scale, x_offset, y_offset); // draw again
}

function draw_Lsystem(Lstring, scale, x_offset, y_offset) {
    const canvas = document.querySelector('.p5Canvas');
    const ctx = canvas.getContext('2d');
    let matrix = new Matrix(ctx);
    matrix.scale(scale, scale);
    matrix.translate(x_offset, y_offset);
    let stack = [];
    let min_x = matrix.e,
        max_x = matrix.e,
        min_y = matrix.f,
        max_y = matrix.f;
    let l = 5;
    for (let i = 0; i < Lstring.length; i++) {
        if (Lstring[i] == "F" || Lstring[i] == "G") { // Draw forward
            line(0, 0, 0, -l);
            matrix.translate(0, -l);
        } else if (Lstring[i] == "f" || Lstring[i] == "g") { // Move forward
            matrix.translate(0, -l);
        } else if (Lstring[i] == "L" || Lstring[i] == "+") {  // Left 90 deg
            matrix.rotate(radians(90));
        } else if (Lstring[i] == "R" || Lstring[i] == "-") { // Right 90 deg
            matrix.rotate(-radians(90));
        } else if (Lstring[i] == "l") { // Left 25 deg
            matrix.rotate(radians(25));
        } else if (Lstring[i] == "r") { // Right 25 deg
            matrix.rotate(-radians(25))
        } else if (Lstring[i] == "[") { // push
            stack.push({e: matrix.e, f: matrix.f, b: matrix.b, c: matrix.c});
        } else if (Lstring[i] == "]") { // pop
            const transf = stack.pop();
            matrix.e = transf.e;
            matrix.f = transf.f;
            matrix.b = transf.b;
            matrix.c = transf.c;
        }
        // Update x, y bounds:
        if (matrix.e < min_x) {
            min_x = matrix.e;
        }
        if (matrix.e > max_x) {
            max_x = matrix.e;
        }
        if (matrix.f < min_y) {
            min_y = matrix.f;
        }
        if (matrix.f > max_y) {
            max_y = matrix.f;
        }
    }
    return [min_x, max_x, min_y, max_y];
}

// Fl[[X]rX]rF[rFX]lX