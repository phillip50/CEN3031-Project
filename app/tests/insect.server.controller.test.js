'use strict';

var should = require('should'),
     app = require('../../server'),
     mongoose = require('mongoose'),
     Insect = mongoose.model('Insect'),
     insectController = require('../../app/controllers/insects'),
     httpMocks = require('node-mocks-http'),
     request = require('supertest');

var user, insect;

describe('Insect Controller Tests', function() {

	 beforeEach(function(done) {
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
		
		req = request(app).post('/insects');

		res = httpMocks.createResponse();
		done();

	});


	 describe('Creating Insects', function() {


		it('should create an inesct', function(done) {
			req = request(app).post('/insects');
			insectController.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(200);
				done();
			});
		});

		it('should fail to create an insect wih no exif data', function(done) {
			insect. = '';
			req.body = insect;
			insectController.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(400);
				done();
			});
      	});


		it('should fail to create an insect that does not match the exif data', function(done) {
			insect. = '';
			req.body = insect;
			insectController.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(400);
				done();
			});
      	});

      	it('should fail to create an insect that does have a png or jpeg type', function(done) {
			insect.contentType = 'image/jpeg';
			req.body = insect;
			insectController.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(400);
				done();
			});
      	});



     });


	  

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




});