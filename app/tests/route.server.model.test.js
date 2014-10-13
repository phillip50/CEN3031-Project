'use strict'
var should = require('should'),
     request = require('supertest');
  




module.exports = function(app) {

	describe('GET /', function(){
    it('respond insect objects', function(done){
      request(app)
        .get('/insects')
        .expect(200, done);
    })
  })
	
};

