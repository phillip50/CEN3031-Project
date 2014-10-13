'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Gallery = mongoose.model('Gallery'),
	_ = require('lodash');

/**
 * Create a gallery
 */
exports.create = function(req, res) {
	var gallery = new Gallery(req.body);
	gallery.user = req.user;

	gallery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gallery);
		}
	});

};

/**
 * Show the current gallery
 */
exports.read = function(req, res) {
	res.jsonp(req.gallery);
};

/**
 * Update a gallery
 */
exports.update = function(req, res) {
	var gallery = req.gallery;

	gallery = _.extend(gallery, req.body);

	gallery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gallery);
		}
	});
};

/**
 * Delete an gallery
 */
exports.delete = function(req, res) {
	var gallery = req.gallery;

	gallery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gallery);
		}
	});
};

/**
 * List of Gallerys
 */
exports.list = function(req, res) {
	Gallery.find().sort('-created').populate('user', 'displayName').exec(function(err, gallerys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gallerys);
		}
	});
};

/**
 * Gallery middleware
 */
exports.galleryByID = function(req, res, next, id) {
	Gallery.findById(id).populate('user', 'displayName').exec(function(err, gallery) {
		if (err) return next(err);
		if (!gallery) return next(new Error('Failed to load gallery ' + id));
		req.gallery = gallery;
		next();
	});
};

/**
 * Gallery authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gallery.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};