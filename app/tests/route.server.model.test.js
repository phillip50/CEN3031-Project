'use strict'
var should = require('should'),
     users = require('../../app/controllers/users'),
	insects = require('../../app/controllers/insects');



module.exports = function(app) {

	describe('GET /', function(){
    it('respond with plain text', function(done){
      request(app)
        .get('/insects')
        .expect(200, done);
        done();
    })
  })
	
};
