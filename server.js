'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	exec = require('child_process').exec;

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Check for GraphicsMagic
exec('gm version', function (err, stdout, stderr) {
	// Validate the output with one of the parameters.
	if (err !== null) {
		console.error('\x1b[31m', 'Could not find GraphicsMagic!', '\x1b[0m');
		throw new Error('Please make sure GraphicsMagic is installed.');
	}
});

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('\x1b[37m\x1b[42m', 'The Insect Collection started on port ' + config.port, '\x1b[0m');
