'use strict';

angular.module('galleries').controller('GalleriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Insects',
	function($scope, $stateParams, $location, Authentication, Galleries) {
		$scope.authentication = Authentication;

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
			$scope.galleries = insects.query();
		};

		$scope.findOne = function() {
			$scope.gallery = galleries.get({
				galleryId: $stateParams.galleryId
			});
		};


	}
]);
