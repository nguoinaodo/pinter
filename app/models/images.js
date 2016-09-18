'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    imageLink: String,
    likers: [String],
    caption: String,
    strategy: String,
    owner_id: String,
    ownerPhoto: String,
    ownerUsername: String
});

module.exports = mongoose.model('Image', Image);