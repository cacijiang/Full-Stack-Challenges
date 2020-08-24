import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from "react-router-dom";
import './styles/p5.css';

import Header from "./components/header/Header";
import States from './components/states/States';
import Example from './components/example/Example';



ReactDOM.render(
    <HashRouter>
        <Header />
        <div className={"nav"}>
            <ul>
                <li id={"example-link"} className={"nav-item"}><Link to="/example" active-color={"orange"}>Example</Link></li>
                <li id={"states-link"} className={"nav-item"}><Link to="/states" active-color={"green"}>States</Link></li>
            </ul>
        </div>
        <Route path="/example" component={Example} />
        <Route path="/states" component={States} />
    </HashRouter>,
    document.getElementById('reactapp'),
);




