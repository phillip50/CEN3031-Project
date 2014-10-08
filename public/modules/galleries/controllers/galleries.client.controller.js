'use strict';

angular.module('galleries').controller('GalleriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Galleries',
	function($scope, $stateParams, $location, Authentication, Galleries) {
		$scope.authentication = Authentication;
		// Test data
		$scope.sample_bugs = [{
			id: 0,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Butterfry',
			pic: 'bug1.png',
			caughtBy : 'Ash',
			location : 'Pallet Town',
			coords: {
				latitude: 29.631146633445802,
				longitude: -82.34787039550469
			}
		}, {
			id: 1,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Ledyba',
			pic: 'bug2.jpg',
			caughtBy : 'Bugsy',
			location : 'Gainesville',
			coords: {
				latitude: 29.64261231,
				longitude: -82.348432409
			}
		}, {
			id: 2,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Caterpie',
			pic: 'bug3.png',
			caughtBy : 'Brock',
			location : 'Hawaii',
			coords: {
				latitude: 29.6328801,
				longitude: -82.3521082
			}
		}, {
			id: 3,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Weedle',
			pic: 'bug4.jpg',
			caughtBy : 'Misty',
			location : 'Somewhere',
			coords: {
				latitude: 29.6308801,
				longitude: -82.3451082
			}
		}, {
			id: 4,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Galvantula',
			pic: 'bug5.png',
			caughtBy : 'Jessie',
			location : 'Nowhere',
			coords: {
				latitude: 29.6368801,
				longitude: -82.3531082
			}
		}, {
			id: 5,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Combee',
			pic: 'combee.png',
			caughtBy : 'James',
			location : 'Nowhere',
			coords: {
				latitude: 29.643162438647163,
				longitude: -82.36231797783205
			}
		}];
		$scope.create = function() {
			var gallery = new Galleries({
				title: this.title,
				content: this.content
			});
			gallery.$save(function(response) {
				$location.path('galleries/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(gallery) {
			if (gallery) {
				gallery.$remove();

				for (var i in $scope.galleries) {
					if ($scope.galleries[i] === gallery) {
						$scope.galleries.splice(i, 1);
					}
				}
			} else {
				$scope.gallery.$remove(function() {
					$location.path('galleries');
				});
			}
		};

		$scope.update = function() {
			var gallery = $scope.gallery;

			gallery.$update(function() {
				$location.path('galleries/' + gallery._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.galleries = galleries.query();
		};

		$scope.findOne = function() {
			$scope.gallery = galleries.get({
				galleryId: $stateParams.galleryId
			});
		};


	}
]);
