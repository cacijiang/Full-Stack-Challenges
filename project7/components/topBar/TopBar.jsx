import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';
import Icon from '@mdi/react'
import {mdiCamera} from '@mdi/js'

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          version: '',
          userId: null,
          user: null,
          context: ''
      };
      this.createTopBarContent = this.createTopBarContent.bind(this);
      this.handleLogOut = this.handleLogOut.bind(this);
      this.handleUploadButtonClicked = this.handleUploadButtonClicked.bind(this);
  }

    componentDidMount() {
        axios.get("http://localhost:3000/test/info").then((res) => {
            this.setState({
                version: res.data['__v'].toString()
            });
        }).catch((error) => {
            console.log("Error occurred!", error);
        });
    }

  componentDidUpdate(prevProps, prevState) {
      if(( prevState.userId !== this.props.match.params.userId)
          || (prevState.context !== this.props.match.params.context)) {
          this.setState({
              userId: this.props.match.params.userId,
              context: this.props.match.params.context,
          });
          if(this.props.match.params.userId !== undefined) {
              axios.get("http://localhost:3000/user/"+this.props.match.params.userId).then((res) => {
                  // console.log("Got data!", res['data']);
                  this.setState({
                      user: res.data
                  });
              }).catch((error) => {
                  console.log("Error occurred!", error);
              });
          }
      }
  }

    handleLogOut() {
      axios.post('http://localhost:3000/admin/logout').then((res) => {
          console.log(res.data);
          this.props.handleLoggedOutChange();
          console.log("login flag",this.props.loginFlag);
      }).catch((err) => {
          console.log(err);
      });

      axios.get("http://localhost:3000/test/info").then((res) => {
          this.setState({
              version: res.data['__v'].toString()
          });
      }).catch((error) => {
          console.log("Error occurred!", error);
      });
  }

    handleUploadButtonClicked(event) {
        event.preventDefault();
        if (this.uploadInput.files.length > 0) {
            // Create a DOM form and add the file to it under the name uploadedphoto
            const domForm = new FormData();
            domForm.append('uploadedphoto', this.uploadInput.files[0]);
            axios.post('/photos/new', domForm)
                .then((res) => {
                    console.log("Photo post response received in React", res.data);
                    this.props.handleUploadChange();
                    console.log("upload flag", this.props.uploadFlag);
                })
                .catch(err => console.log(`POST ERR: ${err}`));
        }
    }

    createTopBarContent() {
      let leftContent = "Please Login";
      let rightContent = "version: " + this.state.version;
      if(this.props.loggedInUser !== null && this.props.loggedInUser !== undefined) {
          leftContent = <div className={"leftContent"}><b>{"Hi " + this.props.loggedInUser.first_name}</b>
              <input id={"choose-file"} type={"file"} accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }}/>
              <label htmlFor="choose-file"><Icon path={mdiCamera} size={1} id={"camera-icon"}/></label>
              <button className={"upload-button"} onClick={this.handleUploadButtonClicked}>Upload</button>
              <button onClick={this.handleLogOut} className={"logout-button"}>Logout</button>
          </div>;
          if(this.state.userId !== undefined && this.state.user !== null) {
              rightContent = this.state.user.first_name + " " + (this.state.context === "photos" ? "photos" : "details");
          } else if(this.state.context === "users") {
              rightContent = "User List";
          }
      }
      return (<div className={"topbar-wrap"}><Typography className={"topbar-left"} variant={"h5"}>{leftContent}</Typography>
          <Typography className={"topbar-right"} variant={"h5"}>{rightContent}</Typography></div>)
    }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
            {this.createTopBarContent()}
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
