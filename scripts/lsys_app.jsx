'use strict';

class LSystemApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            axiom: "F",
            rules: [
                { id: 0, inputVal: "F", outputVal: "F+G" },
                { id: 1, inputVal: "G", outputVal: "F-G" }
            ],
            iterations: "10"
        };
        this.handleAxiomChange = this.handleAxiomChange.bind(this);
        this.handleRulesChange = this.handleRulesChange.bind(this);
        this.handleAddNewRule = this.handleAddNewRule.bind(this);
        this.handleRemoveRule = this.handleRemoveRule.bind(this);
        this.handleIterationsChange = this.handleIterationsChange.bind(this);
        this.handleDragonPreset = this.handleDragonPreset.bind(this);
        this.handleFernPreset = this.handleFernPreset.bind(this);
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
            // console.log(newRules);
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
                />
                <DisplaySegment />
            </div>
        );
    }
}

class DisplaySegment extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="display-segment">
                <div id="sketch-holder"></div>
            </div>
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
                <IterationsPanel value={this.props.iterations} onIterationsChange={this.props.onIterationsChange}/>
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
                    className="short"
                    name="rule-input"
                    value={this.props.inputVal}
                    onChange={(e) => this.handleRulesChange(e, this.props.id, true)}
                />
                &#8614;
                <input
                    type="text"
                    className="medium"
                    name="rule-output"
                    value={this.props.outputVal}
                    onChange={(e) => this.handleRulesChange(e, this.props.id, false)}
                />
                <button
                    className="minus round"
                    onClick={() => this.handleRemoveRule(this.props.id)}
                >&minus;</button>
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
            <ul id="rules-list" className="rules-list no-bullet">
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
                <div className="button-holder">
                    <button
                        className="round plus"
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
    // TODO: ideally we don't want to rely on id="axiom", we want p5 integrated better
    render() {
        return (
            <div className="axiom-panel">
                <h2>Axiom:</h2>
                <input
                    id="axiom"
                    type="text"
                    maxLength="1"
                    className="short"
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
                    id="iters-input"
                    type="number"
                    className="number"
                    name="iters-input"
                    min="0"
                    value={this.props.value}
                    onChange={this.handleIterationsChange}
                />
                <div id="iter-warning"></div>
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
                <h2>Alphabet:</h2>
                <table className="alphabet">
                    <tbody>
                        <tr>
                            <th>Symbol</th>
                            <th>Visual Meaning</th>
                        </tr>
                        <tr>
                            <td>F</td>
                            <td>draw forward</td>
                        </tr>
                        <tr>
                            <td>G</td>
                            <td>draw forward</td>
                        </tr>
                        <tr>
                            <td>f</td>
                            <td>move forward</td>
                        </tr>
                        <tr>
                            <td>g</td>
                            <td>move forward</td>
                        </tr>
                        <tr>
                            <td>L</td>
                            <td>turn left 90&#176;</td>
                        </tr>
                        <tr>
                            <td>R</td>
                            <td>turn right 90&#176;</td>
                        </tr>
                        <tr>
                            <td>l</td>
                            <td>turn left 25&#176;</td>
                        </tr>
                        <tr>
                            <td>r</td>
                            <td>turn right 25&#176;</td>
                        </tr>
                        <tr>
                            <td>[</td>
                            <td>save position (push)</td>
                        </tr>
                        <tr>
                            <td>]</td>
                            <td>restore position (pop)</td>
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
                <button className="round" id="dragon-button" onClick={this.props.onDragonPreset}>Dragon</button>
                <button className="round" id="fern-button" onClick={this.props.onFernPreset}>Fern</button>
            </div>
        );
    }
}


const domContainer = document.getElementById('react-root');
const root = ReactDOM.createRoot(domContainer);
root.render(<LSystemApp />);