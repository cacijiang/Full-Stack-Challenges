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
import axios from 'axios';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import ThumbUpIcon from '@material-ui/icons/ThumbUp';
// import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import FavoriteIcon from "mdi-react/FavoriteIcon";
import FavoriteBorderIcon from "mdi-react/FavoriteBorderIcon";

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
      uploadFlag: this.props.uploadFlag,
      likeAble: true
    };
    this.createSinglePhoto = this.createSinglePhoto.bind(this);
    this.createPhotoList = this.createPhotoList.bind(this);
    this.handlePostComment = this.handlePostComment.bind(this);
    this.handleInputCommentChange = this.handleInputCommentChange.bind(this);
    this.createLike = this.createLike.bind(this);
    // this.fetchPhotos = this.fetchPhotos.bind(this);
  }

  // fetchPhotos() {
  //   axios.get("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
  //     this.setState({
  //       photos: res.data
  //     });
  //   }).catch((error) => {
  //     console.log("Error occurred!", error);
  //   });
  // }

  componentDidMount() {
    axios.get("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
      this.setState({
        photos: res.data
      });
    }).catch((error) => {
      console.log("Error occurred!", error);
    });
    // this.fetchPhotos();
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
      // this.fetchPhotos();
    }
  }

  handleInputCommentChange(event) {
    let photoId = event.target.id.substring("post-comment-input-".length);
    let inputComments = this.state.inputComments;
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
        let inputComments = this.state.inputComments;
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

  hasLiked(photo) {
    // Whether log user has liked this photo
    for(let i = 0; i < photo.likes.length; i++) {
      if(photo.likes[i].user_id === this.props.loggedInUser._id) {
        return true;
      }
    }
    return false;
  }

  handleLikePhoto = photoId => event => {
    event.preventDefault();
    if(this.state.likeAble) {
      this.setState({likeAble: false});
      if(event.target.checked) {
        axios.post('http://localhost:3000/likeOfPhoto/'+photoId).then((res) => {
          console.log("Liked photo ", res.data);
          axios.get("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
            this.setState({
              photos: res.data
            });
          }).catch((error) => {
            console.log("Error occurred!", error);
          });
          // this.fetchPhotos();
        }).catch((error) => {
          console.log("Error occurred!", error);
        });
      } else {
        axios.post('http://localhost:3000/unlikeOfPhoto/'+photoId).then((res) => {
          console.log("Unliked photo ", res.data);
          axios.get("http://localhost:3000/photosOfUser/" + this.state.userId).then((res) => {
            this.setState({
              photos: res.data
            });
          }).catch((error) => {
            console.log("Error occurred!", error);
          });
          // this.fetchPhotos();
        }).catch((error) => {
          console.log("Error occurred!", error);
        });
      }
      setTimeout(() => {
        this.setState({ likeAble: true })
      }, 500);
    }
  };

  createLike(photo) {
    let likeText = "";
    let numLikes = photo.likes.length;
    let likedFlag = this.hasLiked(photo);

    if(likedFlag  && numLikes === 1) {
      likeText = "You liked";
    } else if(likedFlag  && numLikes > 1) {
      likeText = "You and " + (numLikes-1) + " others liked"
    } else if (numLikes > 0){
      likeText = numLikes + " others liked"
    }

    return (
        <FormControlLabel className={"like-container"}
            control={
              <Checkbox
                  icon={<FavoriteBorderIcon />}
                  checkedIcon={<FavoriteIcon />}
                  checked={this.hasLiked(photo)}
                  onChange={this.handleLikePhoto(photo._id)}
                  value="checked"
              />}
            label={
              <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                  className={"like-text"}>
                {likeText}
              </Typography>}
        />
    );
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
              <div className={"like-date-container"}>
                {this.createLike(photo)}
                <Typography variant={"body2"} className={"post-date"}>{photo.date_time}</Typography>
              </div>
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
      this.state.photos.sort((a, b) => b.likes.length !== a.likes.length ?
          b.likes.length - a.likes.length : new Date(a.date_time) - new Date(b.date_time));
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
