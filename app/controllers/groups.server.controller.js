'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Group = mongoose.model('Group'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a group
 */
exports.create = function(req, res) {
	var group = new Group(req.body);
	group.user = req.user;
	group.members.push(req.user);

	group.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

/* Join a Group */
exports.joinGroup = function(req, res) {
	var group = req.group;
	group = _.extend(group, req.body);
	group.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});



	/*Group.update({'_id': group._id}, {$push: {'members': req.user}}, function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res.jsonp({success: true});
		}
	});*/
};

exports.leaveGroup = function(req, res) {
	var group = req.group;
	group = _.extend(group, req.body);


  	Group.findByIdAndUpdate(group._id, {$pull: {'members': req.user}}, function(err, group) {
				if (err) {
						return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
				});
		}
		else {
			res.jsonp(group);
		}
		});
 };

/**
 * Show the current group
 */
exports.read = function(req, res) {
	res.jsonp(req.group);
};

/**
 * Update a group
 */
exports.update = function(req, res) {
	var group = req.group;

	group = _.extend(group, req.body);

	group.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

/**
 * Delete an group
 */
exports.delete = function(req, res) {
	var group = req.group;

	group.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

/**
 * List of Groups
 */
exports.list = function(req, res) {
	var query = req.query,
		find = {};

	if (query.hasOwnProperty('type')) {
		if (query.type === 'Group') find.type = 'Group';
		else if (query.type === 'Class') find.type = 'Class';
	}

	Group.find(find).sort('-created').populate('user', 'displayName').exec(function(err, groups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groups);
		}
	});
};

/**
 * Group middleware
 */
exports.groupByID = function(req, res, next, id) {
	Group.findById(id).populate([{path: 'user', select: 'displayName'}, {path: 'members', select: 'displayName'}]).exec(function(err, group) {
		if (err) return next(err);
		if (!group) return next(new Error('Failed to load group ' + id));
		req.group = group;
		next();
	});
};

/**
 * Group authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.group.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
