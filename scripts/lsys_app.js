'use strict';

class LSystemApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      axiom: "F",
      rules: [{
        id: 0,
        inputVal: "F",
        outputVal: "F+G"
      }, {
        id: 1,
        inputVal: "G",
        outputVal: "F-G"
      }],
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
    this.setState(function (state, props) {
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
    this.setState(function (state, props) {
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
      newRules.push({
        id: newRuleId,
        inputVal: "",
        outputVal: ""
      });
      return {
        rules: newRules
      };
    });
  }
  handleRemoveRule(ruleId) {
    this.setState(function (state, props) {
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
      rules: [{
        id: 0,
        inputVal: "F",
        outputVal: "F+G"
      }, {
        id: 1,
        inputVal: "G",
        outputVal: "F-G"
      }],
      iterations: "10"
    });
  }
  handleFernPreset() {
    this.setState({
      axiom: "X",
      rules: [{
        id: 0,
        inputVal: "X",
        outputVal: "Fl[[X]rX]rF[rFX]lX"
      }, {
        id: 1,
        inputVal: "F",
        outputVal: "FF"
      }],
      iterations: "6"
    });
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "lsystem-app"
    }, /*#__PURE__*/React.createElement(InputSegment, {
      axiom: this.state.axiom,
      rules: this.state.rules,
      iterations: this.state.iterations,
      onAxiomChange: this.handleAxiomChange,
      onIterationsChange: this.handleIterationsChange,
      onRulesChange: this.handleRulesChange,
      onAddNewRule: this.handleAddNewRule,
      onRemoveRule: this.handleRemoveRule,
      onDragonPreset: this.handleDragonPreset,
      onFernPreset: this.handleFernPreset
    }), /*#__PURE__*/React.createElement(DisplaySegment, null));
  }
}
class DisplaySegment extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "display-segment"
    }, /*#__PURE__*/React.createElement("div", {
      id: "sketch-holder"
    }));
  }
}
class InputSegment extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "input-segment"
    }, /*#__PURE__*/React.createElement(AxiomPanel, {
      value: this.props.axiom,
      onAxiomChange: this.props.onAxiomChange
    }), /*#__PURE__*/React.createElement(RulesPanel, {
      rules: this.props.rules,
      onRulesChange: this.props.onRulesChange,
      onAddNewRule: this.props.onAddNewRule,
      onRemoveRule: this.props.onRemoveRule
    }), /*#__PURE__*/React.createElement(IterationsPanel, {
      value: this.props.iterations,
      onIterationsChange: this.props.onIterationsChange
    }), /*#__PURE__*/React.createElement(AlphabetPanel, null), /*#__PURE__*/React.createElement(PresetsPanel, {
      onDragonPreset: this.props.onDragonPreset,
      onFernPreset: this.props.onFernPreset
    }));
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
    return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      maxLength: "1",
      className: "short",
      name: "rule-input",
      value: this.props.inputVal,
      onChange: e => this.handleRulesChange(e, this.props.id, true)
    }), "\u21A6", /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "medium",
      name: "rule-output",
      value: this.props.outputVal,
      onChange: e => this.handleRulesChange(e, this.props.id, false)
    }), /*#__PURE__*/React.createElement("button", {
      className: "minus round",
      onClick: () => this.handleRemoveRule(this.props.id)
    }, "\u2212"));
  }
}

// RulesList Component
class RulesList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const rulesList = this.props.rules.map(rule => {
      return /*#__PURE__*/React.createElement(Rule, {
        key: rule.id,
        id: rule.id,
        inputVal: rule.inputVal,
        outputVal: rule.outputVal,
        onRulesChange: this.props.onRulesChange,
        onRemoveRule: this.props.onRemoveRule
      });
    });
    return /*#__PURE__*/React.createElement("ul", {
      id: "rules-list",
      className: "rules-list no-bullet"
    }, rulesList);
  }
}

// RulesPanel Component
class RulesPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "rules-panel"
    }, /*#__PURE__*/React.createElement("h2", null, "Rules:"), /*#__PURE__*/React.createElement(RulesList, {
      rules: this.props.rules,
      onRulesChange: this.props.onRulesChange,
      onRemoveRule: this.props.onRemoveRule
    }), /*#__PURE__*/React.createElement("div", {
      className: "button-holder"
    }, /*#__PURE__*/React.createElement("button", {
      className: "round plus",
      onClick: this.props.onAddNewRule
    }, "+")));
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
    return /*#__PURE__*/React.createElement("div", {
      className: "axiom-panel"
    }, /*#__PURE__*/React.createElement("h2", null, "Axiom:"), /*#__PURE__*/React.createElement("input", {
      id: "axiom",
      type: "text",
      maxLength: "1",
      className: "short",
      name: "axiom",
      value: this.props.value,
      onChange: this.handleAxiomChange
    }));
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
    return /*#__PURE__*/React.createElement("div", {
      className: "iterations-panel"
    }, /*#__PURE__*/React.createElement("h2", null, "Iterations:"), /*#__PURE__*/React.createElement("input", {
      id: "iters-input",
      type: "number",
      className: "number",
      name: "iters-input",
      min: "0",
      value: this.props.value,
      onChange: this.handleIterationsChange
    }), /*#__PURE__*/React.createElement("div", {
      id: "iter-warning"
    }));
  }
}

// AlphabetPanel Component
class AlphabetPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "alphabet-panel"
    }, /*#__PURE__*/React.createElement("h2", null, "Alphabet:"), /*#__PURE__*/React.createElement("table", {
      className: "alphabet"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Symbol"), /*#__PURE__*/React.createElement("th", null, "Visual Meaning")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "F"), /*#__PURE__*/React.createElement("td", null, "draw forward")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "G"), /*#__PURE__*/React.createElement("td", null, "draw forward")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "f"), /*#__PURE__*/React.createElement("td", null, "move forward")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "g"), /*#__PURE__*/React.createElement("td", null, "move forward")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "L"), /*#__PURE__*/React.createElement("td", null, "turn left 90\xB0")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "R"), /*#__PURE__*/React.createElement("td", null, "turn right 90\xB0")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "l"), /*#__PURE__*/React.createElement("td", null, "turn left 25\xB0")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "r"), /*#__PURE__*/React.createElement("td", null, "turn right 25\xB0")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "["), /*#__PURE__*/React.createElement("td", null, "save position (push)")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "]"), /*#__PURE__*/React.createElement("td", null, "restore position (pop)")))));
  }
}
class PresetsPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "presets-panel"
    }, /*#__PURE__*/React.createElement("h2", null, "Presets:"), /*#__PURE__*/React.createElement("button", {
      className: "round",
      id: "dragon-button",
      onClick: this.props.onDragonPreset
    }, "Dragon"), /*#__PURE__*/React.createElement("button", {
      className: "round",
      id: "fern-button",
      onClick: this.props.onFernPreset
    }, "Fern"));
  }
}
const domContainer = document.getElementById('react-root');
const root = ReactDOM.createRoot(domContainer);
root.render( /*#__PURE__*/React.createElement(LSystemApp, null));