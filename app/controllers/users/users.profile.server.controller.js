'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Insect = mongoose.model('Insect');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
* Show the found user
*/
exports.read = function(req, res) {
	res.jsonp(req.profile);
};

/**
* Show the found user with their insects
*/
exports.profileRead = function(req, res) {
	var userId = req.params.userId;

	Insect.find({user: userId}).select('name image.small description dateFound').sort('-created').limit(12).exec(function(err, insects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Insect.find({user: userId}).count().exec(function(err, count) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp({
						info: req.profile,
						insects: insects,
						count: parseInt(count, 10)
					});
				}
			});
		}
	});
};

/**
* List all users
*/
exports.listUsers = function(req, res) {
	User.find().select('displayName created userDescription').sort('-created').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

/**
* User middleware
*/
exports.safeUserByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).select('firstName lastName displayName classCode school userDescription gatorlink').exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};
