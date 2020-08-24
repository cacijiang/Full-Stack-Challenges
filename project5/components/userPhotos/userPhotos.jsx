import React from 'react';
import {
  Divider,
  Card,
  List,
  ListItem,
  Typography
} from '@material-ui/core';
import './userPhotos.css';
import {Link} from "react-router-dom";
import {fetchModel} from "../../lib/fetchModelData";


/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   userId: this.props.match.params.userId,
    //   photos: window.cs142models.photoOfUserModel(this.props.match.params.userId),
    // };
    this.state = {
      userId: this.props.match.params.userId,
      photos: null,
    };
    this.createSinglePhoto = this.createSinglePhoto.bind(this);
    this.createPhotoList = this.createPhotoList.bind(this);
  }

  componentDidMount() {
    fetchModel("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
      this.setState({
        photos: res['data']
      });
    }).catch((error) => {
      console.log("Error occurred!", error);
    });
  }

  createSinglePhoto(i) {
    const photo = this.state.photos[i];
    let commentArr = [];
    if(photo.comments !== undefined) {
      for(let j = 0; j < photo.comments.length; j++) {
        let comment = photo.comments[j];
        commentArr.push(<ListItem key={comment._id} component={Link} to={"/users/" + comment.user._id} className={"comment-list-item"}><div className={"comment-wrap"}>
          <Typography className={"comment-text"}><b>{comment.user.first_name} {comment.user.last_name}:</b> <q>{comment.comment}</q></Typography>
          <Typography variant={"body2"} className={"comment-date"}>{comment.date_time}</Typography>
        </div></ListItem>);
      }
    }
    return (
        <div className={"card-wrap"}>
        <Card width={"100%"}>
            <div className={"image-container"}>
              <img src={"/images/"+photo.file_name} className={"image"}/>
              <Typography variant={"body2"} className={"post-date"}>{photo.date_time}</Typography>
            </div>
            <Divider />
            <div className={"comments-container"}>
              <List component={"nav"}>{commentArr}</List>
            </div>
        </Card></div>);
  }

  createPhotoList() {
    let returnItems = [];
    if(this.state.photos !== null) {
      for(let i = 0; i < this.state.photos.length; i++) {
        returnItems.push(<ListItem key={this.state.photos[i]._id}>{this.createSinglePhoto(i)}</ListItem>);
      }
    }
    return (<List>{returnItems}</List>);
  }

  render() {
    return (
        <div className={"user-photo-container"}>
          {this.createPhotoList()}
        </div>
    );
  }
}

export default UserPhotos;
