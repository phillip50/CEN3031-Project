'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Insect = mongoose.model('Insect'),
	_ = require('lodash');

/**
 * Create a Insect
 */
exports.create = function(req, res) {
	var Insect = new Insect(req.body);
	Insect.user = req.user;

	Insect.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(Insect);
		}
	});
};

/**
 * Show the current Insect
 */
exports.read = function(req, res) {
	res.jsonp(req.Insect);
};

/**
 * Update a Insect
 */
exports.update = function(req, res) {
	var Insect = req.Insect;

	Insect = _.extend(Insect, req.body);

	Insect.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(Insect);
		}
	});
};

/**
 * Delete an Insect
 */
exports.delete = function(req, res) {
	var Insect = req.Insect;

	Insect.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(Insect);
		}
	});
};

/**
 * List of Insects
 */
exports.list = function(req, res) {
	Insect.find().sort('-created').populate('user', 'displayName').exec(function(err, Insects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(Insects);
		}
	});
};

/**
 * Insect middleware
 */
exports.InsectByID = function(req, res, next, id) {
	Insect.findById(id).populate('user', 'displayName').exec(function(err, Insect) {
		if (err) return next(err);
		if (!Insect) return next(new Error('Failed to load Insect ' + id));
		req.Insect = Insect;
		next();
	});
};

/**
 * Insect authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.Insect.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
