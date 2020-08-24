import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Paper
} from '@material-ui/core';
import { Redirect } from 'react-router'
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import UserList from './components/userList/UserList';
import UserPhotos from './components/userPhotos/UserPhotos';
import LoginRegister from "./components/loginRegister/LoginRegister";
import Activity from "./components/activity/Activity";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginFlag: false,
      loggedInUser: null,
      uploadFlag: false
    };
    this.handleLoggedInUser = this.handleLoggedInUser.bind(this);
    this.handleLoggedOutUser = this.handleLoggedOutUser.bind(this);
    this.handleUploadFlag = this.handleUploadFlag.bind(this);
  }

  handleLoggedInUser(data) {
    this.setState({
      loginFlag: true,
      loggedInUser: data.loggedInUser
    });
    console.log(this.state.loggedInUser);
  }

  handleLoggedOutUser() {
    this.setState({
      loginFlag: false,
      loggedInUser: null
    });
    console.log("User logged out.");
  }

  handleUploadFlag() {
    if(this.state.uploadFlag) {
      this.setState({
        uploadFlag: false
      });
    } else {
      this.setState({
        uploadFlag: true
      });
    }
  }

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          {/*<TopBar loginFlag={this.state.loginFlag} loggedInUser={this.state.loggedInUser} uploadFlag={this.state.uploadFlag} handleUploadChange={this.handleUploadFlag} handleLoggedOutChange={this.handleLoggedOutUser}/>*/}
          <Switch>
            <Route path="/:context/:userId"
                   render={ props => <TopBar {...props} loginFlag={this.state.loginFlag} loggedInUser={this.state.loggedInUser} uploadFlag={this.state.uploadFlag} handleUploadChange={this.handleUploadFlag} handleLoggedOutChange={this.handleLoggedOutUser}/> }
            />
            <Route exact path="/:context"
                   render={ props => <TopBar {...props} loginFlag={this.state.loginFlag} loggedInUser={this.state.loggedInUser} uploadFlag={this.state.uploadFlag} handleUploadChange={this.handleUploadFlag} handleLoggedOutChange={this.handleLoggedOutUser}/> }
            />
            <Route exact path="/" component={TopBar} loginFlag={this.state.loginFlag} loggedInUser={this.state.loggedInUser} uploadFlag={this.state.uploadFlag} handleUploadChange={this.handleUploadFlag} handleLoggedOutChange={this.handleLoggedOutUser}/>
          </Switch>
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper  className="cs142-main-grid-item">
            {this.state.loginFlag ? <UserList /> : ""}
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>
              {this.state.loginFlag ?  <Route path="/users/:userId" render={ props => <UserDetail {...props} /> }/> : <Redirect path="/users/:id" to="/" />}
              {this.state.loginFlag ? <Route path="/photos/:userId" render ={ props => <UserPhotos {...props} uploadFlag={this.state.uploadFlag} handleUploadChange={this.handleUploadFlag} loggedInUser={this.state.loggedInUser}/>}/> : <Redirect path="/photos/:userId" to="/" />}
              {this.state.loginFlag ? <Route exact path="/users" component={UserList}/> : <Redirect path="/users" to="/" />}
              {this.state.loginFlag ? <Route exact path="/activity" component={Activity}/> : <Redirect path="/activity" to="/" />}
              <Route exact path="/" render={props => <LoginRegister {...props} handleLoggedInChange={this.handleLoggedInUser} loginFlag={this.state.loginFlag} loggedInUser={this.state.loggedInUser}/>}/>
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
    </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
