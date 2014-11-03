'use strict';

var should = require('should'),
     app = require('../../server'),
     mongoose = require('mongoose'),
     Insect = mongoose.model('Insect'),
     User = mongoose.model('User'),
     insectController = require('../../app/controllers/insects'),
     httpMocks = require('node-mocks-http'),
     request = require('supertest');

var user,res,req,insect2,insect;

describe('Insect Controller Tests', function() {

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

  req = httpMocks.createRequest({
      method: 'POST',
      url: '/insect',
      body: insect
  });

  //res = httpMocks.createResponse();

  insect2 = new Insect({
        image: {
          small: 'data:image/jpeg;base64,...etc',
          medium: 'data:image/jpeg;base64,...etc',
          large: 'data:image/jpeg;base64,...etc',
          original: 'data:image/jpeg;base64,...etc',
          contentType: 'image/jpeg',
          coordinates: [0, 0]
        },
        name: 'Insect Title',
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

    user.save(function() {
      insect = new Insect({
        image: {
          small: 'data:image/jpeg;base64,...etc',
          medium: 'data:image/jpeg;base64,...etc',
          large: 'data:image/jpeg;base64,...etc',
          original: 'data:image/jpeg;base64,...etc',
          contentType: 'image/jpeg',
          coordinates: [0, 0]
        },
        name: 'Insect Title',
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


/*
   describe('Creating Insects', function() {
      it('should create an inesct', function(done) {
      request(app)
      .post('/insects')
      .send({data: insect2, file: '../../public/images/bug1.png'})
      .expect(200)
        .end(function(err, res){
            if (err) throw err;
        });
    });

    it('400 response to create an insect wih no exif data', function(done) {
      insect.locationTitle = '';
      req.body = insect;
      insectController.create(req,res, function() {
        var status = JSON.parse(res._getStatusCode());
        status.should.equal(400);
        done();
      });
        });


    it('400 response when no  matching exif data', function(done) {
      insect.locationTitle = '';
      req.body = insect;
      insectController.create(req,res, function() {
        var status = JSON.parse(res._getStatusCode());
        status.should.equal(400);
        done();
      });
        });

    it('RES 400 when creating an insect that does have a png or jpeg type', function(done) {
      insect.contentType = 'image/jpeg';
      req.body = insect;
      insectController.create(req,res, function() {
        var status = JSON.parse(res._getStatusCode());
        status.should.equal(400);
        done();
      });
        });



     });
*/
 /* describe('Updating insects', function() {
    it('be able to update an insect', function(done) {
        insectController.update(req, res, function() {
            var status = res._getStatusCode();
            status.should.equal(200);
            done();
        
        
      });
    });

  });


  describe('Delete Insect', function() {
    it('be able to delete an inesct', function(done) {

          insectController.delete(req,res, function() {
            debugger;
            var status = res._getStatusCode();
            status.should.equal(200);
            done();
          });
      

    });
  });
*/

    

    /*Unit Tests for the insect controller*/
   /*
    describe('Degree Conversion', function(){
        it('Should Convert to DMS to decimal degrees', function(){
            var dms ='29/1,3834/100,0/1';
            var direction = 'N';
            insects.convertDMStoDD(dms, direction).should.equal(29.639);
        })

        it('Should Convert to negative when S or W is the direction ', function(){
            var dms ='82/1,2388/100,0/1';
            var direction = 'W';
            insects.convertDMStoDD(dms, direction).should.equal(-82.398);
        })


      })

     describe('Verifying proximity', function(){
        it('Should verify that user location and acutual location are close', function(){
            var dms ='29/1,3834/100,0/1';
            var direction = 'N';
            insects.convertDMStoDD(dms, direction).should.equal(29.639);
        })
     })
    */


  afterEach(function(done) {
    Insect.remove(function() {
      User.remove(function() {
        done();
      });
    });
  });
});