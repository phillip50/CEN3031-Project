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
	formidable = require('formidable'),
	gm = require('gm'),
	ExifImage = require('exif').ExifImage;

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

		// Parsed, now insert data into new insect
		insect.name = fields.name;
		insect.scientificName = fields.scientificName;
		if (fields.hasOwnProperty('description')) insect.description = fields.description;
		insect.dateFound = JSON.parse(fields.dateFound);
		if (fields.hasOwnProperty('commentsEnabled')) insect.commentsEnabled = JSON.parse(fields.commentsEnabled);
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

			// Check for exif data
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

				var latitude = convertDMStoDD(image['Profile-EXIF']['GPS Latitude'], image['Profile-EXIF']['GPS Latitude Ref']),
				    longitude = convertDMStoDD(image['Profile-EXIF']['GPS Longitude'], image['Profile-EXIF']['GPS Longitude Ref']);
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
			});
		});
    });

  	/*var form = new multiparty.Form();
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

		return res.status(400).send({
			message: 'cat'//errorHandler.getErrorMessage(err)
		});

		/*gm(filePath).size(function(err, value) {
			if (err) return res.status(400).send({
				message: err//errorHandler.getErrorMessage(err)
			});
			console.log(value);
  			// note : value may be undefined
		});*/

		// check for exif geo location data
		/*try {
    		new ExifImage({image : tmpPath}, function (error, exifData) {
				// error or no gps data (has to be a better way to write)
        		if (error || _.isEmpty(exifData.gps) || typeof exifData.gps.GPSLatitude !== 'object' || typeof exifData.gps.GPSLatitude !== 'object' || typeof exifData.gps.GPSLatitudeRef !== 'string' || typeof exifData.gps.GPSLongitudeRef !== 'string') {
					return console.log(error.message); res.status(400).send({
						message: error.message
					});
				}
       			else {
					// Convert DMS coords in photo to GeoJSON in the database
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
		} catch (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}*/

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

    });*/
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
	// if id from url is invalid, send nice error
	//if (!mongoose.Types.ObjectId.isValid(id)) return next(new Error('Failed to load insect ' + id));

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
