'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Collection Schema
 */
var CollectionSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	caught: [{
		type : Schema.ObjectId,
		ref: 'Insect'
	}],
	description: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    comments: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }],
    commentsEnabled: {
        type: Boolean,
        default: true
    }
});

mongoose.model('Collection', CollectionSchema);
