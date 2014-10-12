'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Insect = mongoose.model('Insect'),
	_ = require('lodash');


var fs = require('fs');
var uuid = require('uuid'),
    multiparty = require('multiparty');



/**
 * Create a insect
 */
exports.create = function(req, res) {
	 var insect = new Insect();
	 insect.user = req.user;

  	 var form = new multiparty.Form();
  	 form.parse(req, function(err, fields, files) {
  	 	console.log(fields);
  	 	console.log(fields.location[0]);
  	 	console.log(fields.location.coordinates);
  	 	insect.name = fields.name[0];
  	 	insect.scientificName = fields.scientificName[0];
  	 	insect.description = fields.description[0];
  	 	insect.location.title = fields.location.title;
  	 	//insect.location = fields.location[0];
  		//insect.dateFound = fields.dateFound[0];
	
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;


     

        var filePath = fs.readFileSync(file.path);
 		insect.img.contentType = contentType;
        var prefix = 'data:' + contentType + ';base64,';
        var buf = filePath.toString('base64');
        var data = prefix + buf;
        insect.img.data = data;
       
       /* var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
        // uuid is for generating unique filenames. 
        var fileName = uuid.v4() + extension;
        var destPath = __dirname+ fileName;
        */


		insect.save(function(err) {
			if (err) {
				return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			} else {
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
