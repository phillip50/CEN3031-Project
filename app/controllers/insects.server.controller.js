'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Insect = mongoose.model('Insect'),
	_ = require('lodash');


//option for images storage
var options = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
    uploadDir: __dirname + '/../uploads',
    uploadUrl:  '/uploaded/files/',
    storage : {
        type : 'local'
    }
};

var fs = require('fs');
var uploader = require('blueimp-file-upload-expressjs')(options);


/**
 * Create a insect
 */
exports.create = function(req, res) {
  uploader.post(req, res, function (obj) {
	var insect = new Insect(req.body);
	insect.user = req.user;
	//console.log(obj);
	var x = fs.readFileSync('app\\uploads\\' +  obj.files[0].name);
   	insect.img.contentType = obj.files[0].type;
	var prefix = 'data:' + obj.files[0].type + ';base64,';
	var buf = x.toString('base64');
	var data = prefix + buf;
	console.log(data);
	insect.img.data = data;
	
	insect.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
		
			res.jsonp(insect);
		}
	});
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
