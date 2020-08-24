"use strict";

/*
 * Defined the Mongoose Schema and return a Model for a activity
 */

/* jshint node: true */

var mongoose = require('mongoose');

// create a schema for Activity
var activitySchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    info: String,
    photo_id: mongoose.Schema.Types.ObjectId,
    date_time: {type: Date, default: Date.now}
});

// the schema is useless so far
// we need to create a model using it
var Activity = mongoose.model('Activity', activitySchema);

// make this available to our photos in our Node applications
module.exports = Activity;
