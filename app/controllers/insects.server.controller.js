'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Insect = mongoose.model('Insect'),
	_ = require('lodash');


var fs = require('fs'),
    multiparty = require('multiparty'),
	ExifImage = require('exif').ExifImage;

/**
 * Create a insect
 */
exports.create = function(req, res) {
	var insect = new Insect();
	insect.user = req.user;

	function convertDMSToDD(degrees, minutes, seconds, direction) {
		var dd = degrees + minutes/60 + seconds/(60*60);
		if (direction === 'S' || direction === 'W') dd = dd * -1; // Don't do anything for N or E
		return dd;
	}

  	var form = new multiparty.Form();
  	form.parse(req, function(err, fields, files) {
		// Add data from form into insect object
  	 	insect.name = fields.name[0];
  	 	insect.scientificName = fields.scientificName[0];
  	 	insect.description = fields.description[0];
		insect.dateFound = JSON.parse(fields.dateFound[0]);
		insect.commentsEnabled = fields.commentsEnabled[0];
  	 	insect.locationTitle = fields.locationTitle[0];
		insect.loc = JSON.parse(fields.loc[0]);
		insect.loc.type = 'Point';

		// Save image
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;

        var filePath = fs.readFileSync(file.path);
 		insect.image.contentType = contentType;
        var prefix = 'data:' + contentType + ';base64,';
        var buf = filePath.toString('base64');
        var data = prefix + buf;
        insect.image.data = data;

		// check for exif geo location data
    		new ExifImage({image : tmpPath}, function (error, exifData) {
        		if (error) {
					console.log(error);
					return res.status(400).send({
						message: 'Could not verify photo.'
					});
				}
       			else {
            		var latitude = convertDMSToDD(exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[1], exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef);
					var longitude = convertDMSToDD(exifData.gps.GPSLongitude[0], exifData.gps.GPSLongitude[1], exifData.gps.GPSLongitude[2], exifData.gps.GPSLongitudeRef);
					insect.image.coordinates = [longitude, latitude];

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
				}
    		});

        // Server side file type checker.
      /*  if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }

        fs.rename(tmpPath, destPath, function(err) {
            if (err) {
                return res.status(400).send('Image is not saved:');
            }
            return res.json(destPath);
        });
		*/
    });
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
	Insect.find().sort('-created').populate('user', 'displayName').exec(function(err, insects) {
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
