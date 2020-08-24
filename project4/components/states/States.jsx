import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
    this.state = {
      inputValue: '',
      stateList: window.cs142models.statesModel().sort(),
    };
    this.handleChangeBound = event => this.handleChange(event);
    this.searchState = this.searchState.bind(this);
  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  searchState() {
    let listItems = this.state.stateList;
    if(this.state.inputValue !== '') {
      listItems = [];
      for(let i = 0; i < this.state.stateList.length; i++) {
        if(this.state.stateList[i].toLowerCase().includes(this.state.inputValue.toLowerCase())) {
          listItems.push(this.state.stateList[i]);
        }
      }
    }

    let returnItems = [];

    for (let i = 0; i < listItems.length; i++) {
      returnItems.push(<li key={i}> {listItems[i]} </li>);
    }

    return (returnItems.length === 0 ? <p id={"warning"}>State not found.</p> : <ul> {returnItems} </ul>);
  }

  render() {
    return (
      <div className={"search-container"}>
        <div className={"search-bar"}>
          <label htmlFor="inId">Search state:
          </label>
          <input id="inId2" type="text" value={this.state.inputValue} onChange={this.handleChangeBound} placeholder="Search" />
        </div>
        <div className={"search-result"}>
          {this.searchState()}
        </div>
      </div>
    );
  }
}

export default States;
