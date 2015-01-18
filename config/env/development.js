'use strict';

module.exports = {
	//db: 'mongodb://localhost/bugs-dev',
	db: 'mongodb://test:testtest2@ds051630.mongolab.com:51630/theinsectcollection',
	app: {
		title: 'The Insect Collection - Development Environment'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
