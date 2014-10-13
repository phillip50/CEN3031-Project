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
			password: 'password'
		});

		user.save(function() {
			insect = new Insect({
				img:{
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
			insect.img.data = '';

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

	});

	



	
	

	afterEach(function(done) {
		Insect.remove().exec();
		User.remove().exec();
		done();
	});
});
