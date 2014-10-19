'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Insect = mongoose.model('Insect'),
	_ = require('lodash');


var fs = require('fs'),
//	uuid = require('uuid'),
    multiparty = require('multiparty');
var ExifImage = require('exif').ExifImage;

/**
 * Create a insect
 */
exports.create = function(req, res) {
	 var insect = new Insect();
	 insect.user = req.user;

  	 var form = new multiparty.Form();
  	 form.parse(req, function(err, fields, files) {
  	 	insect.name = fields.name[0];
  	 	insect.scientificName = fields.scientificName[0];
  	 	insect.description = fields.description[0];
		insect.dateFound = JSON.parse(fields.dateFound[0]);
		insect.commentsEnabled = fields.commentsEnabled[0],
  	 	insect.location = JSON.parse(fields.location[0]);

		/*_.forEach(fields, function(data, key) {
			if (typeof insect[key] !== 'undefined') console.log(data + ' ' + key);
		});*/

        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;

        var filePath = fs.readFileSync(file.path);
 		insect.image.contentType = contentType;
        var prefix = 'data:' + contentType + ';base64,';
        var buf = filePath.toString('base64');
        var data = prefix + buf;
        insect.image.data = data;

        try {
    		new ExifImage({ image : tmpPath }, function (error, exifData) {
        		if (error)
           		     console.log('Error: '+ error.message);
       		    else
            		console.log(exifData.gps.GPSLatitude);
            		console.log(exifData.gps.GPSLongitude);  // Do something with your data!
    		});
		} catch (error) {
    		console.log('Error: ' + error.message);
		}

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
