'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	gallerys = require('../../app/controllers/gallerys');

module.exports = function(app) {
	// Gallery Routes
	app.route('/gallerys')
		.get(gallerys.list)
		.post(users.requiresLogin, gallerys.create);

	app.route('/gallerys/:galleryId')
		.get(gallerys.read)
		.put(users.requiresLogin, gallerys.hasAuthorization, gallerys.update)
		.delete(users.requiresLogin, gallerys.hasAuthorization, gallerys.delete);

	// Finish by binding the gallery middleware
	app.param('galleryId', gallerys.galleryByID);
};