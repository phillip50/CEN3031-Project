'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	collections = require('../../app/controllers/collections');

module.exports = function(app) {
	// Collection Routes
	app.route('/collections')
		.get(collections.list)
		.post(users.requiresLogin, collections.create);

	app.route('/collections/:collectionId')
		.get(collections.read)
		.put(users.requiresLogin, collections.hasAuthorization, collections.update)
		.delete(users.requiresLogin, collections.hasAuthorization, collections.delete);

	app.route('/collections/:collectionId/comment')
		.post(users.requiresLogin, collections.comment);

	// Finish by binding the collection middleware
	app.param('collectionId', collections.collectionByID);
};
