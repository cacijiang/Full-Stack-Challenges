import React from 'react';
import ReactDOM from 'react-dom';
import './styles/p4.css';

import Header from "./components/header/Header";
import States from './components/states/States';
import Example from './components/example/Example';

class Btn extends React.Component{
    constructor(props) {
        super(props);
        this.state = {flag: true}
    }

    handleClick = () => {
        this.setState({flag: !this.state.flag});
    };

    render() {
        return (
            <div>
                <div className={"button-container"}>
                    <button onClick={this.handleClick} id={"change-button"}>Change the view</button>
                </div>
                {this.state.flag ? <Example /> :  <States />}
            </div>
        );
    }
}

ReactDOM.render(
    <React.Fragment>
        <Header />
        <Btn />
    </React.Fragment>,
    document.getElementById('reactapp'),
);




