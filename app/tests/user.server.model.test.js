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
var user, user2, user3;

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
			gatorlink: 'gator123',
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
			gatorlink: 'gator123',
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

	describe('Initial Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should not be able to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should not be able to save without last name', function(done) {
			user.firstName = 'Full';
			user.lastName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should not be able to save without gatorlink', function(done) {
			user.lastName = 'Name';
			user.gatorlink = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

	});

	describe('Saving Multiple Users', function() {

		it('should be able to save a second user without errors', function(done) {
			user.gatorlink = 'gator123';
      		user.save();
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to save 2 users with the same first name', function(done) {
			user.save();
			user3.firstName = 'Full';
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to save 2 users with the same last name', function(done) {
			user.save();
			user3.lastName = 'Name';
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to save 2 users with the same school', function(done) {
			user.save();
			user3.school = 'School';
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to save 2 users with the same class', function(done) {
			user.save();
			user3.classCode = 'Code123';
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should not be able to save 2 users with same username', function(done) {
			user.save();
			user3.username = 'username';
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should not be able to save 2 users with same gatorlink', function(done) {
			user.save();
			user3.username = 'user';
			user3.gatorlink = 'gator123';
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should not be able to save 2 users with same email', function(done) {
			user.save();
			user3.gatorlink = 'gatorlink123';
			user3.email = 'test@test.com';
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	describe('Modifying Users', function() {
/*
		it('should be able to modify attributes', function(done) {
			user3.email = 'email@email.com';
			user3.save();
			user3.firstName = 'Full';
			return user3.update(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to modify multiple attributes at once', function(done) {
			user3.firstName = 'First';
			user3.save();
			user3.firstName = 'Full';
			user3.lastName = 'Name';
			user3.update(user3, done);
		});

		it('should not be able to update a unique attribute to a previously saved value', function(done) {
			user.save();
			user3.firstName = 'First';
			user3.lastName = 'Last';
			user3.email = 'email@email.com';
			user3.save();
			user3.email = 'test@test.com';
			user3.update(user3, function(err) {
				should.exist(err);
				done();
			});
		});
*/
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});
