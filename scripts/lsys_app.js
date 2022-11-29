'use strict';

const e = React.createElement;
class Rule extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      maxLength: "1",
      className: "short",
      name: "rule-input",
      defaultValue: this.props.inputVal
    }), "\u21A6", /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "medium",
      name: "rule-output",
      defaultValue: this.props.outputVal
    }));
  }
}
class RulesList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("ul", {
      className: "rules-list no-bullet"
    }, /*#__PURE__*/React.createElement(Rule, {
      inputVal: "F",
      outputVal: "F+G"
    }));
  }
}
class RulesPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "rules-panel"
    }, /*#__PURE__*/React.createElement("h2", null, "Rules:"), /*#__PURE__*/React.createElement(RulesList, null));
  }
}
class AxiomPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "axiom-panel"
    }, /*#__PURE__*/React.createElement("h2", null, "Axiom:"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      maxlength: "1",
      class: "short",
      id: "axiom",
      name: "axiom",
      value: "F"
    }));
  }
}
const domContainer = document.getElementById('react-root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(RulesPanel));