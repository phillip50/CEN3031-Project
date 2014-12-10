// Invoke 'strict' JavaScript mode
'use strict';

// Load the test dependencies
var app = require('../../server'),
  request = require('supertest'),
  should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Group = mongoose.model('Group');

// Define global test variables
var user, group;

// Create an 'Articles' controller test suite
describe('Group Controller Unit Tests:', function() {
  // Define a pre-tests function
  beforeEach(function(done) {
    // Create a new 'User' model instance
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

    // Save the new 'User' model instance
    user.save(function() {
      group = new Group({
          name: 'Group title',
          description: 'Group description',
          type: 'Group',
          user: user
      });
     
        group.save(function(err) {
           done();
        });
    });
  });

  // Test the 'Article' GET methods
  describe('Testing the GET methods', function() {
    it('Should be able to get the list of groups', function(done) {
      // Create a SuperTest request
      request(app).get('/groups')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.should.be.an.Array.and.have.lengthOf(1);
          res.body[0].should.have.property('name', group.name);
          res.body[0].should.have.property('description', group.description);

          done();
        });
    });

    it('Should be able to get the specific group', function(done) {
      // Create a SuperTest request
      request(app).get('/groups/' + group.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.should.be.an.Object.and.have.property('type', group.type);
          res.body.should.have.property('description', group.description);

          done();
        });
    });
  });

  // Define a post-tests function
  afterEach(function(done) {
    // Clean the database
    Group.remove(function() {
      User.remove(function() {
        done();
      });
    });
  });
});