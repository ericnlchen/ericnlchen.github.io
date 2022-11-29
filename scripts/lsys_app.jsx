'use strict';

const e = React.createElement;

class Rule extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <li>
                <input type="text" maxLength="1" className="short" name="rule-input" defaultValue={this.props.inputVal} />
                &#8614;
                <input type="text" className="medium" name="rule-output" defaultValue={this.props.outputVal} />
            </li>
        )
    }
}

class RulesList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ul className="rules-list no-bullet">
                <Rule inputVal="F" outputVal="F+G" />
            </ul>
        )
    }
}

class RulesPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="rules-panel">
                <h2>Rules:</h2>
                <RulesList />
            </div>
        )
    }
}

class AxiomPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="axiom-panel">
                <h2>Axiom:</h2>
                <input type="text" maxlength="1" class="short" id="axiom" name="axiom" value="F" />
            </div>
        )
    }
}

const domContainer = document.getElementById('react-root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(RulesPanel));