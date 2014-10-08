'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Insect Schema
 */
var InsectSchema = new Schema({
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
	scientificName: {
		type: String,
		default: '',
		trim: true,
		required: 'Scientific name cannot be blank'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	dateFound: {
		type: Date,
		default: Date.now,
		required: 'Date found cannot be blank'
	},
	location: {
		title: {
			type: String,
			default: '',
			trim: true,
			required: 'Location cannot be blank'
		},
		coordinates: {
			latitude: {
				type: Number,
				default: '',
				required: 'Latitude cannot be blank'
			},
			longitude: {
				type: Number,
				default: '',
				required: 'Longitude cannot be blank'
			}
		}
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comments: {
		type: Schema.ObjectId,
		ref: 'Comment'
	}
});

mongoose.model('Insect', InsectSchema);
