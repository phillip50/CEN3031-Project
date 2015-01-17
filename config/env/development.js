'use strict';

module.exports = {
	//db: 'mongodb://localhost/bugs-dev',
	db: 'mongodb://nodejitsu:ed621fdd5a13277e7ed66782bc3399f7@troup.mongohq.com:10016/nodejitsudb4379934801',
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
