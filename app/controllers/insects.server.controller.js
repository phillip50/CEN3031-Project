'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Insect = mongoose.model('Insect'),
	_ = require('lodash');


var fs = require('fs'),
	formidable = require('formidable'),
	gm = require('gm');

/**
 * Create a insect
 */
exports.create = function(req, res) {
	var insect = new Insect();
	insect.user = req.user;

	function convertDMStoDD(dms, direction) {
		dms = dms.split(',', 3);
		// Convert fractions if any
		for (var i = 0; i < 3; i++) {
			if (dms[i].indexOf('/') !== -1) {
				var number = dms[i].split('/', 2);
				dms[i] = number[0]/number[1];
			}
			continue;
		}
		var dd = dms[0] + dms[1]/60 + dms[2]/(3600);
		if (direction === 'S' || direction === 'W') dd = dd * -1; // Don't do anything for N or E
		return dd;
	}

	// Parse incoming data
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else if (files.file.type !== 'image/png' && files.file.type !== 'image/jpeg') {
			return res.status(400).send({
				message: 'Unsupported file type.'
			});
		}

		// Parsed, now insert data into new insect
		insect.name = fields.name;
		insect.scientificName = fields.scientificName;
		if (fields.description !== 'undefined') insect.description = fields.description;
		insect.dateFound = JSON.parse(fields.dateFound);
		insect.commentsEnabled = JSON.parse(fields.commentsEnabled);
		insect.locationTitle = fields.locationTitle;
		insect.loc = JSON.parse(fields.loc);
		insect.loc.type = 'Point';
		insect.image.contentType = files.file.type;

		fs.readFile(files.file.path, function (err, data) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}

			insect.image.original = 'data:' + files.file.type + ';base64,' + data.toString('base64');

			// Check for exif data, resize into small, medium and large
			gm(data).identify(function(err, image){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				// No GPS exif data (I'm sure there's a better way to write this)
				else if (!image || !image.hasOwnProperty('Profile-EXIF') || !image['Profile-EXIF'].hasOwnProperty('GPS Latitude') || !image['Profile-EXIF'].hasOwnProperty('GPS Latitude Ref') || !image['Profile-EXIF'].hasOwnProperty('GPS Longitude') || !image['Profile-EXIF'].hasOwnProperty('GPS Longitude Ref')) {
					return res.status(400).send({
						message: 'Could not find GPS data in photo.'
					});
				}

				// Image's actual coordinates
				var latitude = convertDMStoDD(image['Profile-EXIF']['GPS Latitude'], image['Profile-EXIF']['GPS Latitude Ref']),
				    longitude = convertDMStoDD(image['Profile-EXIF']['GPS Longitude'], image['Profile-EXIF']['GPS Longitude Ref']);
				insect.image.coordinates = [longitude, latitude];

				// Large
				gm(data).noProfile().resize('950', '950', '^').toBuffer(function(err, buffer) {
					if (err) return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});

					insect.image.large = 'data:' + files.file.type + ';base64,' + buffer.toString('base64');

					// Medium
					gm(buffer).resize('550', '550', '^').toBuffer(function(err, buffer) {
						if (err) return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});

						insect.image.medium = 'data:' + files.file.type + ';base64,' + buffer.toString('base64');

						// Small
						gm(buffer).resize('350', '350', '^').gravity('Center').crop('350', '350').toBuffer(function(err, buffer) {
							if (err) return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});

							insect.image.small = 'data:' + files.file.type + ';base64,' + buffer.toString('base64');

							// Finally save to database
							insect.save(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								}
								else {
									res.jsonp(insect);
								}
							});
						});
					});
				});
			});
		});
    });
	// This is awful!
};

/**
 * Show the current insect
 */
exports.read = function(req, res) {
	res.jsonp(req.insect);
};

/**
 * Update a insect
 */
exports.update = function(req, res) {
	var insect = req.insect;
	//console.log(req);

	insect = _.extend(insect, req.body);

	insect.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insect);
		}
	});
};

/**
 * Delete an insect
 */
exports.delete = function(req, res) {
	var insect = req.insect;

	insect.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insect);
		}
	});
};

/**
 * List of Insects
 */
exports.list = function(req, res) {
	Insect.find().select('+image.small').sort('-created').populate('user', 'displayName').exec(function(err, insects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insects);
		}
	});
};

/**
 * Insect middleware
 */
exports.insectByID = function(req, res, next, id) {
	Insect.findById(id).select('+image.large').populate('user', 'displayName').exec(function(err, insect) {
		if (err) return next(err);
		if (!insect) return next(new Error('Failed to load insect ' + id));
		req.insect = insect;
		next();
	});
};

/**
 * Insect authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.insect.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
