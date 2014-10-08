'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
	insects = require('../../app/controllers/insects');

module.exports = function(app) {
	// Insect Routes
	app.route('/insects')
		.get(insects.list)
		.post(users.requiresLogin, insects.create);

	app.route('/insects/:insectId')
		.get(insects.read)
		.put(users.requiresLogin, insects.hasAuthorization, insects.update)
		.delete(users.requiresLogin, insects.hasAuthorization, insects.delete);

	// Finish by binding the insect middleware
	app.param('insectId', insects.insectByID);
};
