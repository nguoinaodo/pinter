'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
		photo: String
	},
	twitter: {
	    id: String,
	    username: String,
	    displayName: String,
	    photo: String
	},
	facebook: {
	    id: String,
	    username: String,
	    displayName: String,
	    photo: String  
	},
    imageIds: [String]
});

module.exports = mongoose.model('User', User);
