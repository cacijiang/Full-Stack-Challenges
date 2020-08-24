"use strict";

/*
 * Defined the Mongoose Schema and return a Model for a Photo
 */

/* jshint node: true */

var mongoose = require('mongoose');

/*
 * Photo can have comments and we stored them in the Photo object itself using
 * this Schema:
 */
var commentSchema = new mongoose.Schema({
    comment: String,     // The text of the comment.
    date_time: {type: Date, default: Date.now}, // The date and time when the comment was created.
    user_id: mongoose.Schema.Types.ObjectId,    // 	The ID of the user who created the comment.
});

var likeSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId
});

// create a schema for Photo
var photoSchema = new mongoose.Schema({
    file_name: String, // 	Name of a file containing the actual photo (in the directory project6/images).
    date_time: {type: Date, default: Date.now}, // 	The date and time when the photo was added to the database
    user_id: mongoose.Schema.Types.ObjectId, // The ID of the user who created the photo.
    comments: [commentSchema], // Array of comment objects representing the comments made on this photo.
    visible: Boolean, // Whether the user would like to set the share list
    share_list: [{user_id: mongoose.Schema.Types.ObjectId}], // Arrays of users' id on the share list
    likes: [likeSchema]
});

// the schema is useless so far
// we need to create a model using it
var Photo = mongoose.model('Photo', photoSchema);

// make this available to our photos in our Node applications
module.exports = Photo;
