import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
}
from '@material-ui/core';
import { Link } from "react-router-dom";
import Icon from '@mdi/react'
import { mdiAccount } from '@mdi/js';
import {fetchModel} from "../../lib/fetchModelData.js";

import './userList.css';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   userList: window.cs142models.userListModel(),
    // };
    this.state = {
      userList: null,
    };
    this.createNameList = this.createNameList.bind(this);
  }

  componentDidMount() {
    fetchModel("http://localhost:3000/user/list").then((res) => {
      this.setState({
        userList: res['data']
      });
    }).catch((error) => {
      console.log("Error occurred!", error);
    });
  }

  createNameList() {
    let returnItems = [];
    let t = 0;
    if(this.state.userList !== null) {
      for(let i  = 0; i < this.state.userList.length; i++) {
        let currentUser = this.state.userList[i];
        returnItems.push(<ListItem button key={t} component={Link} to={"/users/" + currentUser._id}>
          <ListItemText primary={currentUser.first_name + " " +currentUser.last_name} align={"center"}/></ListItem>);
        t++;
        returnItems.push(<Divider key={t}/>);
        t++;
      }
    }
    return returnItems;
  }

  render() {
    return (
      <div className={"user-list-container"}>
          <Icon path={mdiAccount} size={2} id={"user-profile-icon"}/>
        <List component="nav">
          {this.createNameList()}
        </List>
      </div>
    );
  }
}

export default UserList;
