// const axiom = "F";
// const rules = [
//   {
//     input: "F",
//     output: "F+G",
//   },
//   {
//     input: "G",
//     output: "F-[-G]-F",
//   },
// ];
// const iters = 8;

const axiom = "F";
const rules = [
  {
    input: "F",
    output: "F[-F]F[+F]F",
  },
  {
    input: "[",
    output: "-[[-",
  },
  {
    input: "]",
    output: "]F[FF-]+]+",
  },
];
const iters = 7;

function grow(axiom, rules, iters) {
  let lString = [axiom];
  for (let i = 0; i < iters; i++) {
    lString = parallelRewrite(rules, lString);
  }
  return lString;
}

function parallelRewrite(rules, lString) {
  let newLString = [];
  for (let i = 0; i < lString.length; i++) {
    const ruleIndex = rules.findIndex((rule) => rule.input === lString[i]);
    if (ruleIndex === -1) {
      newLString.push(lString[i]);
    } else {
      let result = rules[ruleIndex].output;
      newLString.push(...result);
    }
  }
  return newLString;
}

export const lString = grow(axiom, rules, iters);
console.log(lString);

export function indexOfClosingBrace(lString, index) {
  let bracketCounter = 1;
  while (bracketCounter > 0 && index < lString.length) {
    index++;
    if (lString[index] === "]") {
      bracketCounter--;
    } else if (lString[index] === "[") {
      bracketCounter++;
    }
  }
  if (index === lString.length) {
    throw new Error("no matching bracket!");
  }
  return index;
}
