'use strict';

angular.module('collections').controller('CollectionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Collections','Insects',
	function($scope, $stateParams, $location, Authentication, Collections, Insects) {
		$scope.authentication = Authentication;

		$scope.createPage = function() {
			// If user is not signed in then redirect back
			if (!$scope.authentication.user) $location.path('/collections');

			$scope.selectedBugs = [];
		};

		$scope.create = function() {
			var collection = new Collections({
				name: this.name,
				description: this.description,
				caught: $scope.selectedBugs
			});
			collection.$save(function(response){
				$location.path('collections/' + response._id);
				$scope.name = '';
				$scope.description = '';
				$scope.caught = [];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.selectedBugs = [];
		};

		$scope.remove = function(collection) {
			if (collection) {
				collection.$remove();

				for (var i in $scope.collections) {
					if ($scope.collections[i] === collection) {
						$scope.collections.splice(i, 1);
					}
				}
			} else {
				$scope.collection.$remove(function() {
					$location.path('collections');
				});
			}
		};

		$scope.update = function() {
			var collection = $scope.collection;

			collection.$update(function() {
				$location.path('collections/' + collection._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.loading = true;
			$scope.collections = Collections.query(function() {
				$scope.loading = false;
			});
		};

		$scope.findOne = function() {
			$scope.loading = true;
			$scope.collection = Collections.get({
				collectionId: $stateParams.collectionId
			}, function() {
				$scope.loading = false;
			});
		};

		$scope.addInsect = function() {
			var insectId = this.insect._id;
			var index = $scope.selectedBugs.indexOf(insectId);
			if(index === -1) {
				$scope.selectedBugs.push(insectId);
			}
			else {
				$scope.selectedBugs.splice(index, 1);
			}
		};
	}
]);
