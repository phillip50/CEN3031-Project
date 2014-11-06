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

	// If the selected location and actual location of the photo are not within close range
	// this function will return false
	function checkProximity(given, wanted) {
		// [longitude, latitude]
		var longitudePercentError = Math.abs((given[0] - wanted[0]) / wanted[0]);
		var latitudePercentError = Math.abs((given[1] - wanted[1]) / wanted[1]);

		if (longitudePercentError < 0.000075 && latitudePercentError < 0.000075) return true;
		else return false;
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
		insect.galleryName = fields.galleryName;
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
				else if (!image.hasOwnProperty('Profile-EXIF') || !image['Profile-EXIF'].hasOwnProperty('GPS Latitude') || !image['Profile-EXIF'].hasOwnProperty('GPS Latitude Ref') || !image['Profile-EXIF'].hasOwnProperty('GPS Longitude') || !image['Profile-EXIF'].hasOwnProperty('GPS Longitude Ref')) {
					return res.status(400).send({
						message: 'Could not find GPS data in photo.'
					});
				}
				// No Date exif data
				else if (!image.hasOwnProperty('Profile-EXIF') || !image['Profile-EXIF'].hasOwnProperty('Date Time Original')) {
					return res.status(400).send({
						message: 'Could not find date and time in photo.'
					});
				}

				// Image's actual coordinates
				var latitude = convertDMStoDD(image['Profile-EXIF']['GPS Latitude'], image['Profile-EXIF']['GPS Latitude Ref']),
				    longitude = convertDMStoDD(image['Profile-EXIF']['GPS Longitude'], image['Profile-EXIF']['GPS Longitude Ref']);
				insect.image.coordinates = [longitude, latitude];

				// Check if photo's coords are near user's given
				if (checkProximity(insect.loc.coordinates, insect.image.coordinates) === false) {
					return res.status(400).send({
						message: 'Your selected location and the photo\'s location are not nearby.'
					});
				}

				// Check if dates match
				var a = image['Profile-EXIF']['Date Time Original'].split(/:| /),
					dateTaken = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);

				if (dateTaken.toDateString() !== insect.dateFound.toDateString()) {
					return res.status(400).send({
						message: 'Your selected date and the photo\'s date are not the same.'
					});
				}
				insect.image.dateTaken = dateTaken;

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
* Download insect's image
*/
exports.downloadImage = function(req, res) {
	var size = req.params.size,
		insectId = req.params.insectId;

	// Not a valid size
	if (['small', 'medium', 'large', 'original'].indexOf(size) === -1) {
		return res.status(400).send({
			message: 'Invalid image size for download.'
		});
	}

	// Fetch image
	Insect.findById(insectId).select('image.' + size + ' user image.contentType').populate('user', 'displayName').exec(function(err, insect) {
		if (err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		if (!insect) return res.status(400).send({
			message: 'Failed to load insect.'
		});
		if (insect.user.id !== req.user.id && size === 'original') return res.status(403).send({
			message: 'You are not authorized to download the original image.'
		});

		res.set({
			'Content-Type': insect.image.contentType,
			'Content-Disposition': 'attachment; filename="image.png"'
		});
		res.send(insect.image[size]);

		/*res.set({
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename="image.png"'
		});
		res.send(insect.image[size].replace(/^data:image\/[^;]/, 'data:application/octet-stream'));*/
	});
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
	var query = req.query,
		limit = 50;
	if (query.hasOwnProperty('limit')) {
		if (parseInt(query.limit, 10) && parseInt(query.limit, 10) <= 50 && parseInt(query.limit, 10) > 0) {
			limit = parseInt(query.limit, 10);
		}
		else {
			return res.status(400).send({
				message: 'Invalid limit for query.'
			});
		}
	}

	Insect.find().select('+image.small').sort('-created').populate('user', 'displayName').limit(limit).exec(function(err, insects) {
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
exports.insectByIDLargeImage = function(req, res, next, id) {
	Insect.findById(id).select('+image.large').populate('user', 'displayName').exec(function(err, insect) {
		if (err) return next(err);
		if (!insect) return next(new Error('Failed to load insect ' + id));
		req.insect = insect;
		next();
	});
};

exports.insectByID = function(req, res, next, id) {
	Insect.findById(id).populate('user', 'displayName').exec(function(err, insect) {
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
