import React from 'react';
import {
  AppBar, Toolbar, Typography,Checkbox
} from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';
import Icon from '@mdi/react';
import {mdiCamera} from '@mdi/js';
import { Multiselect } from 'multiselect-react-dropdown';
import { NavLink } from "react-router-dom";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

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
          context: '',
          checked: false,
          users: null,
          shareList: []
      };
      this.createTopBarContent = this.createTopBarContent.bind(this);
      this.handleLogOut = this.handleLogOut.bind(this);
      this.handleUploadButtonClicked = this.handleUploadButtonClicked.bind(this);
      this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
      this.onSelect = this.onSelect.bind(this);
      this.onRemove = this.onRemove.bind(this);
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
          if(this.props.loggedInUser !== null && this.props.loggedInUser !== undefined) {
              axios.get("http://localhost:3000/user/list").then((res) => {
                  let users = res.data;
                  users.forEach(user => user["full_name"] = user["first_name"] + " " + user["last_name"]);
                  this.setState({
                      users: users
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
          console.log("login flag", this.props.loginFlag);
          this.setState({checked: false, shareList: []});
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
            domForm.append('checked', this.state.checked);
            domForm.append('shareList', JSON.stringify(this.state.shareList));
            axios.post('/photos/new', domForm)
                .then((res) => {
                    console.log("Photo post response received in React", res.data);
                    this.props.handleUploadChange();
                    ToastsStore.success("Photo uploaded successfully!");
                    console.log("upload flag", this.props.uploadFlag);
                    this.setState({checked: false, shareList: []});
                })
                .catch(err => console.log(`POST ERR: ${err}`));
        }
    }

    handleCheckboxChange() {
      if(this.state.checked) {
          this.setState({checked: false});
      } else {
          this.setState({checked: true});
      }
    }

    onSelect(selectedList, selectedItem) {
      console.log("Selected user: ", selectedItem);
      this.setState({
          shareList: selectedList
      });
    }

    onRemove(selectedList, removedItem) {
        console.log("Unselected user: ", removedItem);
        this.setState({
            shareList: selectedList
        });
    }

    createTopBarContent() {
      let leftContent = "Please Login";
      let rightContent = "version: " + this.state.version;
      if(this.props.loggedInUser !== null && this.props.loggedInUser !== undefined) {
          leftContent = <div className={"leftContent"}><b>{"Hi " + this.props.loggedInUser.first_name}</b>
                  <input id={"choose-file"} type={"file"} accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }}/>
                  <label htmlFor="choose-file"><Icon path={mdiCamera} size={1} id={"camera-icon"}/></label>
                  <label className={"check-box-container"}><Checkbox checked={this.state.checked} onChange={this.handleCheckboxChange} className={"check-box"}/>
                  <span>private</span></label>
              {this.state.users === null ? "" : <Multiselect
                  options={this.state.users} // Options to display in the dropdown
                  onSelect={this.onSelect} // Function will trigger on select event
                  onRemove={this.onRemove} // Function will trigger on remove event
                  displayValue={"full_name"}// Property name to display in the dropdown options
                  placeholder={"Select users to share"}
                  avoidHighlightFirstOption={true}
                  showCheckbox={true}
                  closeOnSelect={false}
              />}
                  <button className={"upload-button"} onClick={this.handleUploadButtonClicked}>Upload</button>
              <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/>
          </div>;
          if(this.state.userId !== undefined && this.state.user !== null) {
              rightContent = <div className={"rightContent"}>{this.state.user.first_name + " " + (this.state.context === "photos" ? "photos" : "details")}
                  <NavLink to="/activity" className={"activity-button"}>Activity</NavLink>
              {/*<button onClick={this.handleGoActivity} className={"activity-button"}>Activity</button>*/}
              <button onClick={this.handleLogOut} className={"logout-button"}>Logout</button></div>
          } else if(this.state.context === "users") {
              rightContent = <div className={"rightContent"}>{"User List"}
                  <NavLink to="/activity" className={"activity-button"}>Activity</NavLink>
              {/*<button onClick={this.handleGoActivity} className={"activity-button"}>Activity</button>*/}
                  <button onClick={this.handleLogOut} className={"logout-button"}>Logout</button></div>;
          } else if(this.state.context === "activity"){
              rightContent = <div className={"rightContent"}>{"Activities"}
                  <button onClick={this.handleLogOut} className={"logout-button"}>Logout</button></div>;
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
