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
	image: {
		small: { // 350x350
			type: String,
			default: '',
			select: false,
			required: true
		},
		medium: { // 550
			type: String,
			default: '',
			select: false,
			required: true
		},
		large: { // 950
			type: String,
			default: '',
			select: false,
			required: true
		},
		original: {
			type: String,
			default: '',
			required: true,
			select: false
		},
		contentType: {
			type: String,
			default: '',
			required: 'Content type is required'
		},
		coordinates: {
			type: [Number], // [<longitude>, <latitude>]
			required: 'Coordinates cannot be blank',
			select: false
		},
		dateTaken: {
			type: Date,
			default: Date.now,
			required: 'Date taken cannot be blank',
			select: false
		}
	},
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
	galleryName: {
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
	locationTitle: {
		type: String,
		default: '',
		trim: true,
		required: 'Location cannot be blank'
	},
	loc: { // GeoJSON object!
		type: {
			type: String,
			default: 'Point',
	    	enum: ['Point', 'LineString', 'Polygon'],
			required: true
	  	},
	  	coordinates: {
			type: [Number], // [<longitude>, <latitude>]
			required: 'Coordinates cannot be blank'
		}
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

InsectSchema.index({loc: '2dsphere'}, {created: 1});
mongoose.model('Insect', InsectSchema);
