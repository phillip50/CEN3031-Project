'use strict';

(function() {
	// Insects Controller Spec
	describe('InsectsController', function() {
		// Initialize global variables
		var InsectsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Insects controller.
			InsectsController = $controller('InsectsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one insect object fetched from XHR', inject(function(Insects) {
			// Create sample insect using the Insects service
			var sampleInsect = new Insects({
				image: {
					small: 'data:image/jpeg;base64,...etc',
					medium: 'data:image/jpeg;base64,...etc',
					large: 'data:image/jpeg;base64,...etc',
					original: 'data:image/jpeg;base64,...etc',
					contentType: 'image/jpeg',
					coordinates: [0, 0]
				},
				name: 'Insect from test',
				scientificName: 'Insect scientific name',
				description: 'Insect description',
				dateFound: new Date(),
				locationTitle: 'Location title',
				loc: {
					type: 'Point',
					coordinates: [0,0]
				},
				commentsEnabled: true
			});

			var sampleCount = {
				count: 1
			};

			// Create a sample insects array that includes the new insect
			var sampleInsects = [sampleInsect];

			// Set GET response
			$httpBackend.expectGET('insects?limit=12&skip=0').respond(sampleInsects);
			$httpBackend.expectGET('insects?count=1').respond(sampleCount);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.insects).toEqualData(sampleInsects);
			expect(scope.count).toEqualData(sampleCount);
		}));

		it('$scope.findOne() should create an array with one insect object fetched from XHR using a insectId URL parameter', inject(function(Insects) {
			// Define a sample insect object
			var sampleInsect = new Insects({
				image: {
					large: 'data:image/jpeg;base64,...etc',
					contentType: 'image/jpeg'
				},
				name: 'Insect from test',
				scientificName: 'Insect scientific name',
				description: 'Insect description',
				dateFound: new Date(),
				locationTitle: 'Location title',
				loc: {
					type: 'Point',
					coordinates: [0,0]
				},
				comments: [],
				commentsEnabled: true
			});

			// Set the URL parameter
			$stateParams.insectId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/insects/).respond(sampleInsect);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.insect).toEqualData(sampleInsect);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Insects) {
			// Create a sample insect object
			var sampleInsectPostData = new Insects({
				image: {
					small: 'data:image/jpeg;base64,...etc',
					medium: 'data:image/jpeg;base64,...etc',
					large: 'data:image/jpeg;base64,...etc',
					original: 'data:image/jpeg;base64,...etc',
					contentType: 'image/jpeg',
					coordinates: [0, 0]
				},
				name: 'Insect from test',
				scientificName: 'Insect scientific name',
				description: 'Insect description',
				dateFound: new Date(),
				locationTitle: 'Location title',
				loc: {
					type: 'Point',
					coordinates: [0,0]
				},
				commentsEnabled: true
			});

			// Create a sample insect response
			var sampleInsectResponse = new Insects({
				image: {
					large: 'data:image/jpeg;base64,...etc',
					contentType: 'image/jpeg'
				},
				name: 'Insect from test',
				scientificName: 'Insect scientific name',
				description: 'Insect description',
				dateFound: new Date(),
				created: new Date(),
				locationTitle: 'Location title',
				loc: {
					type: 'Point',
					coordinates: [0,0]
				},
				commentsEnabled: true
			});

			// Fixture mock form input values
			scope.insectTitle = 'Insect from Test';
			scope.scientificName = 'Insect from Test';
			scope.description = 'An insect about tests!';
			scope.dt = new Date();
			scope.locationTitle = 'The Swamp';
			scope.latitude = 29.631146633445802;
			scope.longitude = -82.34787039550469;

			// Set POST response
			$httpBackend.expect('/insects').respond(200,'sucess');

			// Run controller functionality
		/*	scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');
			expect(scope.insectTitle).toEqual('');
			expect(scope.scientificName).toEqual('');
			expect(scope.description).toEqual('');
			expect(scope.dt).toEqual('');
			expect(scope.locationTitle).toEqual('');
			expect(scope.latitude).toEqual('');
			expect(scope.longitude).toEqual('');

			// Test URL redirection after the insect was created
			expect($location.path()).toEqual('/insects/' + sampleInsectResponse._id);
		*/
		}));

		it('$scope.update() should update a valid insect', inject(function(Insects) {
			// Define a sample insect put data
			var sampleInsectPutData = new Insects({
				name: 'Insect from test (updated)',
				scientificName: 'Insect scientific name (updated)',
				description: 'Insect description (updated)',
				locationTitle: 'Location title (updated)',
				commentsEnabled: false
			});

			// Mock insect in scope
			scope.insect = sampleInsectPutData;

			// Set PUT response
			$httpBackend.expectPUT(/insects/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/insects/' + sampleInsectPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid insectId and remove the insect from the scope', inject(function(Insects) {
			// Create new insect object
			var sampleInsect = new Insects({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new insects array and include the insect
			scope.insects = [sampleInsect];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/insects\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInsect);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.insects.length).toBe(0);
		}));
	});
}());
