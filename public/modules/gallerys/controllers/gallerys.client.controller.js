'use strict';

angular.module('gallerys').controller('GallerysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gallerys',
	function($scope, $stateParams, $location, Authentication, Gallerys) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var gallery = new Gallerys({
				title: this.title,
				content: this.content
			});
			gallery.$save(function(response) {
				$location.path('gallerys/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(gallery) {
			if (gallery) {
				gallery.$remove();

				for (var i in $scope.gallerys) {
					if ($scope.gallerys[i] === gallery) {
						$scope.gallerys.splice(i, 1);
					}
				}
			} else {
				$scope.gallery.$remove(function() {
					$location.path('gallerys');
				});
			}
		};

		$scope.update = function() {
			var gallery = $scope.gallery;

			gallery.$update(function() {
				$location.path('gallerys/' + gallery._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.gallerys = Gallerys.query();
		};

		$scope.findOne = function() {
			$scope.gallery = Gallerys.get({
				galleryId: $stateParams.galleryId
			});
		};
	}
]);