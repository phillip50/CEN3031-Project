'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
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
	description: {
		type: String,
		default: '',
		trim: true
	},
	type: {
		type: String,
		enum: ['Group', 'Class'],
		required: 'Group type cannot be blank'
	},
	isPrivate: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	members: [{
		type : Schema.ObjectId,
		ref: 'User'
	}],
	insects: [{
		type : Schema.ObjectId,
		ref: 'Insect'
	}],
	galleries: [{
		type : Schema.ObjectId,
		ref: 'Gallery'
	}]
});

mongoose.model('Group', GroupSchema);
