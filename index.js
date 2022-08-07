"use strict";

function setup() {
    createCanvas(windowWidth, windowHeight);

    const addBtn = document.getElementById("add_button");
    addBtn.addEventListener('click', () => {
        const ul = document.getElementById("rules_list");
        const last_item = ul.lastElementChild;
        const new_item = last_item.cloneNode(true);
        // const last_index = last_item.children[0].id.match(/\d+/)[0];
        // new_item.children[0].id = `rule_${+last_index + 1}_input`;
        // new_item.children[1].id = `rule_${+last_index + 1}_output`;
        ul.appendChild(new_item);
    });
}

function draw() {
    background(255);
    frameRate(10);
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

    let iters = 11;

    let Lstring = Lsystem(0, axiom, rules, iters);
    console.log(Lstring);
    draw_Lsystem(Lstring, theta);
}

function Lsystem(alphabet, axiom, rules, iters) {
    // TODO: validate input
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
        if (rules.get(axiom[j]) === undefined) new_axiom += axiom[j];
        else new_axiom += rules.get(axiom[j]);
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