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
			ufid: '11110000',
			classCode: '123',
			school:'University of Florida'
		});

		user.save(function() {
			insect = new Insect({
				image:{
					data: 'DAFAFRWSADASD',
					contentType: 'image/png'
				},
				name: 'Insect Title',
				scientificName: 'Insect Content',
				description: 'Insect description',
				dateFound: '10/12/14',
				location: {
					title: 'Title',
					coordinates: {
						latitude: 10,
						longitude: 10,
					}
				},
				
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

	it('should have an image', function(done) {
			insect.image.data = '';

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

	it('should have a scientificName', function(done) {
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


	it('should have a location', function(done) {
			insect.location.title = '';

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

	it('should have a latitude', function(done) {
			insect.location.coordinates.latitude = null;

			return insect.save(function(err) {
				should.exist(err);
				done();
			});
		});

	it('should have a longitude', function(done) {
			insect.location.coordinates.longitude = null;

			return insect.save(function(err) {
				should.exist(err);
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
