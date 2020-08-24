import React from 'react';
import {
  Divider, Typography
} from '@material-ui/core';
import { Link } from "react-router-dom";
// import {fetchModel} from "../../lib/fetchModelData.js";
import './userDetail.css';
import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //     userId: this.props.match.params.userId,
    //     user: window.cs142models.userModel(this.props.match.params.userId),
    // }
      this.state = {
          userId: this.props.match.params.userId,
          user: null,
      };
      this.createUserDetails = this.createUserDetails.bind(this);
  }

  componentDidMount() {
      // fetchModel("http://localhost:3000/user/"+this.state.userId).then((res) => {
      //     this.setState({
      //         user: res['data']
      //     });
      // }).catch((error) => {
      //     console.log("Error occurred!", error);
      // });

      axios.get("http://localhost:3000/user/"+this.state.userId).then((res) => {
          this.setState({
              user: res.data
          });
      }).catch((error) => {
          console.log("Error occurred!", error);
      });
  }

    componentDidUpdate(prevProps, prevState) {
      if(prevState.userId !== null && prevState.userId !== this.props.match.params.userId) {
          this.setState({
              userId: this.props.match.params.userId,
          });
          // fetchModel("http://localhost:3000/user/"+this.props.match.params.userId).then((res) => {
          //     // console.log("Got data!", res['data']);
          //     this.setState({
          //         user: res['data']
          //     });
          // }).catch((error) => {
          //     console.log("Error occurred!", error);
          // });

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

    createUserDetails() {
      if(this.state.user === null) {
          return "";
      }
      return ( <div className={"user-details"}>
          <div className={"intro-container"}>
              <div className={"name-wrap"}><Typography variant={"h2"}>{this.state.user.first_name} {this.state.user.last_name}</Typography>
                  <Typography variant={"body1"} className={"info"}>{this.state.user.occupation} | {this.state.user.location}</Typography></div>
          </div>
          <div className={"description-container"}>
              <blockquote className={"description"}>{this.state.user.description}</blockquote>
          </div>
          <Divider className={"divider"}/>
          <div className={"photo-link-container"}>
              <Link to={"/photos/"+this.state.userId} className={"photo-link"}>Click Here to Photos!</Link>
          </div>
      </div>);
    }

    render() {
    return (
        <div>{this.createUserDetails()}</div>
    );
  }
}

export default UserDetail;
