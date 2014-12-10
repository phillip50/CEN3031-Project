'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Insect = mongoose.model('Insect');

/**
 * Globals
 */
var user, insect;

/**
 * Unit tests
 */
describe('Insect Model Unit Tests:', function() {
	beforeEach(function(done) {

		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			school: 'school',
			classCode: 'classCode'
		});

		user.save(function() {
			insect = new Insect({
				image: {
					small: 'data:image/jpeg;base64,...etc',
					medium: 'data:image/jpeg;base64,...etc',
					large: 'data:image/jpeg;base64,...etc',
					original: 'data:image/jpeg;base64,...etc',
					contentType: 'image/jpeg',
					coordinates: [0, 0],
					dateTaken: new Date()
				},
				name: 'Insect Title',
				galleryName: 'gallery',
				scientificName: 'Insect Content',
				description: 'Insect Description',
				dateFound: new Date(),
				locationTitle: 'Location Title',
				loc: {
					type: 'Point',
					coordinates: [0,0]
				},
				commentsEnabled: true,
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return insect.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should have a small image', function(done) {
			insect.image.small = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have a medium image', function(done) {
			insect.image.medium = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have a large image', function(done) {
			insect.image.large = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have a original image', function(done) {
			insect.image.original = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have photo set coordinates', function(done) {
			insect.image.coordinates = null;

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have a name', function(done) {
			insect.name = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have a scientific name', function(done) {
			insect.scientificName = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have a date', function(done) {
			insect.dateFound = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should have an location title', function(done) {
			insect.locationTitle = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have user set coordinates', function(done) {
			insect.loc.coordinates = null;

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to delete an insect', function(done) {
			insect.loc.coordinates = [0,0];
			insect.save();
			return insect.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Insect.remove().exec();
		User.remove().exec();
		done();
	});
});
