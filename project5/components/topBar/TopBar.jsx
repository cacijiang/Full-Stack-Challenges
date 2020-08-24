import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import {fetchModel} from "../../lib/fetchModelData";

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //     userId: this.props.match.params.userId,
    //     user: window.cs142models.userModel(this.props.match.params.userId),
    //     context: this.props.match.params.context,
    // };
      this.state = {
          userId: this.props.match.params.userId,
          user: null,
          context: this.props.match.params.context,
          version: "",
      };
      this.createTopBarContent = this.createTopBarContent.bind(this);
  }

  componentDidMount() {
      if(this.state.userId !== undefined) {
          fetchModel("http://localhost:3000/user/"+this.state.userId).then((res) => {
              this.setState({
                  user: res['data']
              });
          }).catch((error) => {
              console.log("Error occurred!", error);
          });
      }
      fetchModel("http://localhost:3000/test/info").then((res) => {
          this.setState({
              version: res.data['__v'].toString()
          });
      }).catch((error) => {
          console.log("Error occurred!", error);
      });
  }

    componentDidUpdate(prevProps, prevState) {
        if((prevState.userId !== null && prevState.userId !== this.props.match.params.userId)
            || (prevState.context !== null && prevState.context !== this.props.match.params.context)) {
            this.setState({
                userId: this.props.match.params.userId,
                context: this.props.match.params.context,
            });
            if(this.state.userId !== undefined) {
                fetchModel("http://localhost:3000/user/"+this.props.match.params.userId).then((res) => {
                    // console.log("Got data!", res['data']);
                    this.setState({
                        user: res['data']
                    });
                }).catch((error) => {
                    console.log("Error occurred!", error);
                });
            }
            fetchModel("http://localhost:3000/test/info").then((res) => {
                this.setState({
                    version: res.data['__v'].toString()
                });
            }).catch((error) => {
                console.log("Error occurred!", error);
            });
        }
    }

    createTopBarContent() {
      let leftContent = "Welcome to Photo Sharing App!";
      let rightContent = "version: " + this.state.version;
      if(this.state.userId !== undefined && this.state.user !== null) {
          leftContent = <b>{this.state.user.first_name + " " + this.state.user.last_name}</b>;
          rightContent = this.state.user.first_name + "'s " + (this.state.context === "photos" ? "photos" : "details");
      } else if(this.state.context === "users") {
          rightContent = "User List";
      }
        return (<div className={"topbar-wrap  "}><Typography className={"topbar-left"} variant={"h5"}>{leftContent}</Typography>
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
