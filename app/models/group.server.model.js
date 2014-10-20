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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	members: [{
		type : Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Group', GroupSchema);
