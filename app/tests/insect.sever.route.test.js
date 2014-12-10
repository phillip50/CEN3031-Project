'use strict';

var should = require('should'),
     app = require('../../server'),
     mongoose = require('mongoose'),
     User = mongoose.model('User'),
     Insect = mongoose.model('Insect'),
     request = require('supertest');

var user, insect;

describe('Insect Server Test', function() {
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
          dateTaken:  new Date(),
        },
        name: 'Insect Title',
        galleryName: 'Gallery',
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

      insect.save(function(err) {
        done();
      });
    });
  });

  describe('Testing the GET methods', function() {
    it('Should recieve list of insects', function(done) {
      request(app).get('/insects')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.should.be.an.Array.and.have.lengthOf(1);
          res.body[0].should.have.property('name', insect.name);
          res.body[0].should.have.property('description', insect.description);

          done();
        }
      );
    });

    it('Should be able to recieve specific insect', function(done) {
      request(app).get('/insects/' + insect.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.should.be.an.Object.and.have.property('name', insect.name);
          res.body.should.have.property('name', insect.name);
          res.body.should.have.property('description', insect.description);

          done();
        }
      );
    });

   });

  afterEach(function(done) {
    Insect.remove(function() {
      User.remove(function() {
        done();
      });
    });
  });
});
