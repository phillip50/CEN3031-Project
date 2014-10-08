'use strict';

(function() {
	// Insects Controller Spec
	describe('GalleriesController', function() {
		// Initialize global variables
		var GalleriesController,
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
			GalleriesController = $controller('GalleriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one insect object fetched from XHR', inject(function(Insects) {
			// Create sample insect using the Insects service
			var sampleGallery = new Galleries({
				title: 'An Insect about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample insects array that includes the new insect
			var sampleGalleries = [sampleGallery];

			// Set GET response
			$httpBackend.expectGET('galleries').respond(sampleGalleries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.galleries).toEqualData(sampleGalleries);
		}));

		it('$scope.findOne() should create an array with one insect object fetched from XHR using a insectId URL parameter', inject(function(Insects) {
			// Define a sample insect object
			var sampleGallery = new Galleries({
				title: 'An Insect about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.galleryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gallerys\/([0-9a-fA-F]{24})$/).respond(sampleGallery);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gallery).toEqualData(sampleGallery);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Insects) {
			// Create a sample insect object
			var sampleGalleryPostData = new Galleries({
				title: 'An Insect about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample insect response
			var sampleGalleryResponse = new Galleries({
				_id: '525cf20451979dea2c000001',
				title: 'An Insect about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Insect about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('insects', sampleGalleryPostData).respond(sampleGalleryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the insect was created
			expect($location.path()).toBe('/galleries/' + sampleGalleryResponse._id);
		}));

		it('$scope.update() should update a valid gallery', inject(function(Galleries) {
			// Define a sample insect put data
			var sampleGalleryPutData = new Galleries({
				_id: '525cf20451979dea2c000001',
				title: 'An Insect about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock insect in scope
			scope.gallery = sampleGalleryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/galleries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/galleries/' + sampleGalleryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid galleryId and remove the gallery from the scope', inject(function(Insects) {
			// Create new insect object
			var sampleGallery = new Galleries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new insects array and include the insect
			scope.galleries = [sampleGallery];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/galleries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGallery);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.galleries.length).toBe(0);
		}));
	});
}());
