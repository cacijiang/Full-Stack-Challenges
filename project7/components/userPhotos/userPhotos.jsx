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
// import {fetchModel} from "../../lib/fetchModelData";
import axios from 'axios';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.match.params.userId,
      photos: null,
      inputComments: {},
      uploadFlag: this.props.uploadFlag
    };
    this.createSinglePhoto = this.createSinglePhoto.bind(this);
    this.createPhotoList = this.createPhotoList.bind(this);
    this.handlePostComment = this.handlePostComment.bind(this);
    this.handleInputCommentChange = this.handleInputCommentChange.bind(this);
    // this.handleUpdatePhoto = this.handleUpdatePhoto.bind(this);
  }

  componentDidMount() {
    axios.get("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
      this.setState({
        photos: res.data
      });
    }).catch((error) => {
      console.log("Error occurred!", error);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.uploadFlag === false && prevState.uploadFlag !== this.props.uploadFlag) {
      this.props.handleUploadChange();
      axios.get("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
        this.setState({
          photos: res.data
        });
      }).catch((error) => {
        console.log("Error occurred!", error);
      });
    }
  }

  // handleUpdatePhoto() {
  //   if(this.props.uploadFlag) {
  //     axios.get("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
  //       this.setState({
  //         photos: res.data
  //       });
  //     }).catch((error) => {
  //       console.log("Error occurred!", error);
  //     });
  //     this.props.handleUploadChange();
  //   }
  // }

  handleInputCommentChange(event) {
    var photoId = event.target.id.substring("post-comment-input-".length);
    var inputComments = this.state.inputComments;
    inputComments[photoId] = event.target.value;
    this.setState({
      inputComments: inputComments
    })
  }

  handlePostComment(event) {
    event.preventDefault();
    const photoId = event.target.id.substring("post-comment-form-".length);
    const addedComment = this.state.inputComments[photoId];
    axios.post('http://localhost:3000/commentsOfPhoto/'+photoId, {comment: addedComment}).then((res) => {
      console.log("Photo updated successfully received by react", res.data);
      axios.get("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
        var inputComments = this.state.inputComments;
        inputComments[photoId] = '';
        this.setState({
          photos: res.data,
          inputComments: inputComments
        });
      }).catch((error) => {
        console.log("Error occurred!", error);
      });
    }).catch((err) => {
      console.log("Error occurred in axios post", err);
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

    // Add input placeholder for new comments
    commentArr.push(<ListItem key={0} className={"comment-list-item"}><div className={"comment-wrap"}>
      <form onSubmit={this.handlePostComment} className={"post-comment-form"} id={"post-comment-form-"+photo._id}>
        <label>
          <input id={"post-comment-input-"+photo._id} type="text" placeholder={"Add comment..."}
                 value={this.state.inputComments[photo._id] || ''} onChange={this.handleInputCommentChange}/>
        </label>
        <br/>
        <button type={"submit"} className={"post-comment-button"}>POST</button>
      </form>
    </div></ListItem>);

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
