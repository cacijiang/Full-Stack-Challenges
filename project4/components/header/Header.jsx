import React from 'react';
import './Header.css';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header>
                <div className={"header-container"}>
                    <h1>Life is Elsewhere</h1>
                    <p><q> War is Peace, Freedom is Slavery, Ignorance is Strength.</q></p>
                </div>
            </header>
        );
    }
}

export default Header;
