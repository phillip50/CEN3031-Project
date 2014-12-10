'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Collection = mongoose.model('Collection'),
	User = mongoose.model('User'),
	Comment = mongoose.model('Comment'),
	_ = require('lodash');

/**
 * Create a collection
 */
exports.create = function(req, res) {
	var collection = new Collection(req.body);
	collection.user = req.user;

	collection.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(collection);
		}
	});

};

/**
 * Show the current collection
 */
exports.read = function(req, res) {
	res.jsonp(req.collection);
};

/**
* Comment on a insect
*/
exports.comment = function(req, res) {
	var collection = req.collection;

	if (!collection.commentsEnabled) return res.status(400).send({
		message: 'Comments for this collection is disabled.'
	});

	var comment = new Comment();
	comment.user = req.user;
	comment.content = req.body.content;

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			Collection.findByIdAndUpdate(collection._id, {$push: {'comments': comment}}, function(err, collection) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp({success: true});
				}
			});
		}
	});
};

/**
 * Update a collection
 */
exports.update = function(req, res) {
	var collection = req.collection;

	collection = _.extend(collection, req.body);

	collection.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(collection);
		}
	});
};

/**
 * Delete an collection
 */
exports.delete = function(req, res) {
	var collection = req.collection;

	collection.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(collection);
		}
	});
};

/**
 * List of Collections
 */
exports.list = function(req, res) {
	var query = req.query,
		find = {};

	if (query.hasOwnProperty('userId')) find.user = query.userId;

	Collection.find(find).sort('-created').populate('user', 'displayName').populate({path: 'caught', select: 'image.small', options: { limit: 8}}).exec(function(err, collections) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(collections);
		}
	});
};

/**
 * Collection middleware
 */
exports.collectionByID = function(req, res, next, id) {
	Collection.findById(id).populate('user', 'displayName').populate({path: 'caught', select: '+image.small'}).populate('comments').exec(function(err, collection) {
		if (err) return next(err);
		if (!collection) return next(new Error('Failed to load collection ' + id));

		var options = {
			path: 'comments.user',
			select: 'displayName',
			model: 'User'
		};

		Collection.populate(collection, options, function (err, collection2) {
			if (err) return next(err);
			if (!collection2) return next(new Error('Failed to load insect ' + id));

			req.collection = collection2;
			next();
		});
	});
};

/**
 * Collection authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.collection.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
