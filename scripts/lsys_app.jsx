'use strict';

// React Components:
class LSystemApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            axiom: "F",
            rules: [
                { id: 0, inputVal: "F", outputVal: "F+G" },
                { id: 1, inputVal: "G", outputVal: "F-G" }
            ],
            iterations: "10",
            maxStringLengthExceeded: false
        };
        this.handleAxiomChange = this.handleAxiomChange.bind(this);
        this.handleRulesChange = this.handleRulesChange.bind(this);
        this.handleAddNewRule = this.handleAddNewRule.bind(this);
        this.handleRemoveRule = this.handleRemoveRule.bind(this);
        this.handleIterationsChange = this.handleIterationsChange.bind(this);
        this.handleDragonPreset = this.handleDragonPreset.bind(this);
        this.handleFernPreset = this.handleFernPreset.bind(this);
        this.setMaxStringLengthExceeded = this.setMaxStringLengthExceeded.bind(this);
    }

    handleAxiomChange(axiomText) {
        this.setState({
            axiom: axiomText
        });
    }

    handleRulesChange(newValue, ruleId, isInputChange) {
        this.setState(function(state, props) {
            let newRules = [];
            let newRule = {};
            for (const rule of state.rules) {
                if (rule.id != ruleId) {
                    newRules.push(rule);
                } else {
                    if (isInputChange) {
                        newRule = {
                            id: ruleId,
                            inputVal: newValue,
                            outputVal: rule.outputVal
                        };
                    } else {
                        newRule = {
                            id: ruleId,
                            inputVal: rule.inputVal,
                            outputVal: newValue
                        };
                    }
                    newRules.push(newRule);
                }
            }
            return {
                rules: newRules
            };
        });
    }

    handleAddNewRule() {
        this.setState(function(state, props) {
            const ruleIds = state.rules.map(rule => {
                return rule.id;
            });
            let newRuleId = 0;
            if (ruleIds.length != 0) {
                newRuleId = Math.max.apply(null, ruleIds) + 1;
            }
            let newRules = [];
            for (const rule of state.rules) {
                newRules.push(rule);
            }
            newRules.push({id: newRuleId, inputVal: "", outputVal: ""});
            return {
                rules: newRules
            };
        });
    }

    handleRemoveRule(ruleId) {
        this.setState(function(state, props) {
            let newRules = [];
            for (const rule of state.rules) {
                if (rule.id != ruleId) {
                    newRules.push(rule);
                }
            }
            return {
                rules: newRules
            };
        });
    }

    handleIterationsChange(iterationsText) {
        // this.setState(function(state, props) {
        //     if (state.maxStringLengthExceeded) {
        //         return {
        //             iterations: state.iterations
        //         }
        //     }
        //     else {
        //         return {
        //             iterations: iterationsText
        //         };
        //     }
        // });
        this.setState({
            iterations: iterationsText
        });
    }

    handleDragonPreset() {
        this.setState({
            axiom: "F",
            rules: [
                { id: 0, inputVal: "F", outputVal: "F+G" },
                { id: 1, inputVal: "G", outputVal: "F-G" }
            ],
            iterations: "10"
        });
    }

    handleFernPreset() {
        this.setState({
            axiom: "X",
            rules: [
                { id: 0, inputVal: "X", outputVal: "Fl[[X]rX]rF[rFX]lX" },
                { id: 1, inputVal: "F", outputVal: "FF" }
            ],
            iterations: "6"
        });
    }

    setMaxStringLengthExceeded(boolVal) {
        this.setState({
            maxStringLengthExceeded: boolVal
        });
    }

    render() {
        return (
            <div className="lsystem-app">
                <InputSegment
                    axiom={this.state.axiom}
                    rules={this.state.rules}
                    iterations={this.state.iterations}
                    onAxiomChange={this.handleAxiomChange}
                    onIterationsChange={this.handleIterationsChange}
                    onRulesChange={this.handleRulesChange}
                    onAddNewRule={this.handleAddNewRule}
                    onRemoveRule={this.handleRemoveRule}
                    onDragonPreset={this.handleDragonPreset}
                    onFernPreset={this.handleFernPreset}
                    maxStringLengthExceeded={this.state.maxStringLengthExceeded}
                />
                <DisplaySegment
                    axiom={this.state.axiom}
                    rules={this.state.rules}
                    iterations={this.state.iterations}
                    MAX_STRING_LENGTH={100000}
                    setMaxStringLengthExceeded={this.setMaxStringLengthExceeded}
                />
            </div>
        );
    }
}

class DisplaySegment extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    Sketch = (p) => {
        p.setup = () => {
            const CANVAS_WIDTH = p.windowWidth/3;
            const CANVAS_HEIGHT = p.windowWidth/3;
            const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
            // Ensure that the canvas display size and coordinate system size match
            const p5Canvas = document.querySelector('.p5Canvas');
            p5Canvas.setAttribute('width', CANVAS_WIDTH);
            p5Canvas.setAttribute('height', CANVAS_HEIGHT);
            p.noLoop();
        };

        p.draw = () => {
            console.log("draw");
            p.background(255);
            p.stroke(70,130,70);
            p.strokeWeight(1)
            p.strokeJoin(p.ROUND);
            p.smooth();
            let Lstring = p.Lsystem(this.props.axiom, this.props.rules, this.props.iterations);
            p.showLsystem(Lstring);
        };

        p.Lsystem = (axiom, rules, iters) => {
            let i = 0;
            let underMaxStringLength = true;
            while (i < iters) {
                let old_axiom = axiom;
                axiom = p.grow(axiom, rules);
                // If we exceed the maximum length, we want to discard that iteration entirely and use only the previous axiom
                if (axiom.length > this.props.MAX_STRING_LENGTH) { 
                    console.log(`Max string length exceeded at ${i} iterations!`);
                    this.props.setMaxStringLengthExceeded(true);
                    underMaxStringLength = false;
                    axiom = old_axiom; // revert to previous axiom
                    break;
                }
                i++;
            }
            if (underMaxStringLength) {
                this.props.setMaxStringLengthExceeded(false);
            }
            return axiom;
        };

        p.grow = (axiom, rules) => {
            let new_axiom = "";
            for (let j = 0; j < axiom.length; j++) {
                const index = rules.findIndex(x => x.inputVal === axiom[j]);
                if (index === -1) {
                    new_axiom += axiom[j];
                }
                else {
                    new_axiom += rules[index].outputVal;
                }
            }
            return new_axiom;
        };

        p.showLsystem = (Lstring) => {
            // This function draws the Lsystem, rescales and recenters coordinates, and then redraws
            const [min_x, max_x, min_y, max_y] = p.drawLsystem(Lstring, 1, 0, 0); // draw once
            p.clear();
            const canvasWidth = p.width;
            const canvasHeight = p.height;
            let drawingWidth = Math.abs(max_x - min_x);
            let drawingHeight = Math.abs(max_y - min_y);
        
            const x_scale = canvasWidth / drawingWidth;
            const y_scale = canvasHeight / drawingHeight;
            const scale = Math.min(x_scale, y_scale);
        
            const x_offset = Math.abs(min_x);
            const y_offset = Math.abs(min_y);
            p.drawLsystem(Lstring, scale, x_offset, y_offset); // draw again
        };

        p.drawLsystem = (Lstring, scale, x_offset, y_offset) => {
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
                    p.line(0, 0, 0, -l);
                    matrix.translate(0, -l);
                } else if (Lstring[i] == "f" || Lstring[i] == "g") { // Move forward
                    matrix.translate(0, -l);
                } else if (Lstring[i] == "L" || Lstring[i] == "+") {  // Left 90 deg
                    matrix.rotate(-p.radians(90));
                } else if (Lstring[i] == "R" || Lstring[i] == "-" || Lstring[i] == '\u2212') { // Right 90 deg (Note there are multiple - characters)
                    matrix.rotate(p.radians(90));
                } else if (Lstring[i] == "l") { // Left 25 deg
                    matrix.rotate(-p.radians(25));
                } else if (Lstring[i] == "r") { // Right 25 deg
                    matrix.rotate(p.radians(25))
                } else if (Lstring[i] == "[") { // push
                    stack.push({a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f});
                } else if (Lstring[i] == "]") { // pop
                    if (stack.length !== 0) {
                        const transf = stack.pop();
                        matrix.a = transf.a;
                        matrix.b = transf.b;
                        matrix.c = transf.c;
                        matrix.d = transf.d;
                        matrix.e = transf.e;
                        matrix.f = transf.f;
                        matrix._setCtx();
                    }
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
        };
    }

    handleResize(newWidth, newHeight) {
        this.myP5.resizeCanvas(newWidth, newHeight);
    }

    componentDidMount() {
        this.myP5 = new p5(this.Sketch, this.myRef.current);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.axiom !== this.props.axiom || 
            prevProps.rules !== this.props.rules ||
            prevProps.iterations !== this.props.iterations) {
            this.myP5.redraw();
        }
    }

    render() {
        return (
            <div className="display-segment" ref={this.myRef}></div>
        );
    }
}

class InputSegment extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="input-segment">
                <AxiomPanel value={this.props.axiom} onAxiomChange={this.props.onAxiomChange}/>
                <RulesPanel rules={this.props.rules} onRulesChange={this.props.onRulesChange} onAddNewRule={this.props.onAddNewRule} onRemoveRule={this.props.onRemoveRule}/>
                <IterationsPanel value={this.props.iterations} onIterationsChange={this.props.onIterationsChange} maxStringLengthExceeded={this.props.maxStringLengthExceeded}/>
                <AlphabetPanel />
                <PresetsPanel onDragonPreset={this.props.onDragonPreset} onFernPreset={this.props.onFernPreset}/>
            </div>
        );
    }
}

// Rule Component
class Rule extends React.Component {
    constructor(props) {
        super(props);
        this.handleRulesChange = this.handleRulesChange.bind(this);
        this.handleRemoveRule = this.handleRemoveRule.bind(this);
    }

    handleRulesChange(e, ruleId, isInputChange) {
        this.props.onRulesChange(e.target.value, ruleId, isInputChange);
    }

    handleRemoveRule(ruleId) {
        this.props.onRemoveRule(ruleId);
    }

    render() {
        return (
            <li>
                <input
                    type="text"
                    maxLength="1"
                    className="width-20"
                    name="rule-input"
                    value={this.props.inputVal}
                    onChange={(e) => this.handleRulesChange(e, this.props.id, true)}
                />
                &rarr;
                <input
                    type="text"
                    className="width-90"
                    name="rule-output"
                    value={this.props.outputVal}
                    onChange={(e) => this.handleRulesChange(e, this.props.id, false)}
                />
                <button
                    className="red round"
                    onClick={() => this.handleRemoveRule(this.props.id)}
                >
                    &minus;
                </button>
            </li>
        );
    }
}

// RulesList Component
class RulesList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const rulesList = this.props.rules.map((rule) => {
            return <Rule
                key={rule.id}
                id={rule.id}
                inputVal={rule.inputVal}
                outputVal={rule.outputVal} 
                onRulesChange={this.props.onRulesChange}
                onRemoveRule={this.props.onRemoveRule}
            />
        });

        return (
            <ul className="rules-list center-items no-bullet">
                {rulesList}
            </ul>
        );
    }
}

// RulesPanel Component
class RulesPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="rules-panel">
                <h2>Rules:</h2>
                <RulesList rules={this.props.rules} onRulesChange={this.props.onRulesChange} onRemoveRule={this.props.onRemoveRule}/>
                <div className="center">
                    <button
                        className="green round"
                        onClick={this.props.onAddNewRule}
                    >+</button>
                </div>
            </div>
        );
    }
}

// AxiomPanel Component
class AxiomPanel extends React.Component {
    constructor(props) {
        super(props);
        this.handleAxiomChange = this.handleAxiomChange.bind(this);
    }

    handleAxiomChange(e) {
        this.props.onAxiomChange(e.target.value);
    }
    render() {
        return (
            <div className="axiom-panel">
                <h2>Axiom:</h2>
                <input
                    type="text"
                    maxLength="1"
                    className="width-20"
                    name="axiom"
                    value={this.props.value}
                    onChange={this.handleAxiomChange}
                />
            </div>
        );
    }
}

// IterationsPanel Component
class IterationsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.handleIterationsChange = this.handleIterationsChange.bind(this);
    }

    handleIterationsChange(e) {
        this.props.onIterationsChange(e.target.value);
    }

    render() {
        return (
            <div className="iterations-panel">
                <h2>Iterations:</h2>
                <input
                    type="number"
                    className="width-50"
                    name="iters-input"
                    min="0"
                    value={this.props.value}
                    onChange={this.handleIterationsChange}
                />
                {this.props.maxStringLengthExceeded && 
                    <div className="warning-message">
                        Max length exceeded
                    </div>
                }
            </div>
        );
    }
}

// AlphabetPanel Component
class AlphabetPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="alphabet-panel">
                <h2>Symbols:</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Symbol</th>
                            <th>Visual Meaning</th>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">F</em></td>
                            <td><span className="bubble">draw forward</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">G</em></td>
                            <td><span className="bubble">draw forward</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">f</em></td>
                            <td><span className="bubble">move forward</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">g</em></td>
                            <td><span className="bubble">move forward</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">+</em></td>
                            <td><span className="bubble">turn left 90&#176;</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">&minus;</em></td>
                            <td><span className="bubble">turn right 90&#176;</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">l</em></td>
                            <td><span className="bubble">turn left 25&#176;</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">r</em></td>
                            <td><span className="bubble">turn right 25&#176;</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">[</em></td>
                            <td><span className="bubble">push</span></td>
                        </tr>
                        <tr>
                            <td><em className="darkgreen">]</em></td>
                            <td><span className="bubble">pop</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class PresetsPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="presets-panel">
                <h2>Presets:</h2>
                <button className="round" onClick={this.props.onDragonPreset}>Dragon</button>
                <button className="round" onClick={this.props.onFernPreset}>Fern</button>
            </div>
        );
    }
}

const domContainer = document.getElementById('react-root');
const root = ReactDOM.createRoot(domContainer);
root.render(<LSystemApp />);