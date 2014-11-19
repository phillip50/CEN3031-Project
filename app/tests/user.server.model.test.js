'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			gatorlink: '1234-5678',
			school: 'School',
			classCode: 'Code123',
			userDescription: 'User Description goes here',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			gatorlink: '1234-5678',
			school: 'School',
			classCode: 'Code123',
			userDescription: 'User Description goes here',
			provider: 'local'
		});
		user3 = new User({
			firstName: 'First',
			lastName: 'Last',
			displayName: 'First Last',
			email: 'email@email.com',
			username: 'user',
			password: '12345678',
			gatorlink: 'gatorlink123',
			school: 'University',
			classCode: 'class123',
			userDescription: 'no description',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should not be able to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should not be able to save without username', function(done) {
			user.firstName = 'Full';
			user.username = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to save a second user without errors', function(done) {
			user.username = 'username';
			user.save();
			user3.save(done);
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});
