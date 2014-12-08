'use strict';

angular.module('collections').controller('CollectionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Collections','Insects',
	function($scope, $stateParams, $location, Authentication, Collections, Insects) {
		$scope.authentication = Authentication;
		$scope.selectedBugs = [];

		$scope.getInsects = function() {
			var skip = 0;

			$scope.insects = Insects.query({
				limit: 12,
				skip: skip
			});

			// Get total count
			Insects.get({count: 1}, function(data) {
				$scope.pagination.totalItems = data.count;
			});
	        $scope.changeClass = function(){
	          if ($scope.src === 'btn-default')
	            $scope.src = 'btn-success';
	          else
	            $scope.src = 'btn-default';
	        };
			$scope.pagination = {
				totalItems: 0,
				currentPage: 0,
				itemsPerPage: 12,
				pageChanged: function(page) {
					$scope.insects = Insects.query({
						limit: 12,
						skip: ($scope.pagination.currentPage - 1) * 12
					});
					$location.search({
						skip: ($scope.pagination.currentPage - 1) * 12
					});
				}
			};
		};
		$scope.create = function() {
			var collection = new Collections({
				title: this.title,
				content: this.content,
				caught: $scope.selectedBugs
			});
			collection.$save(function(response){
				$location.path('collections/' + response._id);
				$scope.title = '';
				$scope.content = '';
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
			$scope.collections = Collections.query();
		};

		$scope.findOne = function() {
			$scope.collection = Collections.get({
				collectionId: $stateParams.collectionId
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