'use strict';

angular.module('collections').controller('CollectionsController', ['$state', '$scope', '$http', '$stateParams', '$location', 'Authentication', 'Collections','Insects',
	function($state, $scope, $http, $stateParams, $location, Authentication, Collections, Insects) {
		$scope.authentication = Authentication;

		$scope.createPage = function() {
			// If user is not signed in then redirect back
			if (!$scope.authentication.user) $location.path('/collections');

			$scope.loading = true;
			$scope.commentsEnabled = true;
			$scope.insects = [];
			$scope.selectedInsects = [];
			$scope.insects = Insects.query({limit: 100}, function() {
				$scope.loading = false;
			});

			$scope.addInsect = function() {
				var insectId = this.insect._id;
				var index = $scope.selectedInsects.indexOf(insectId);
				if (index === -1) $scope.selectedInsects.push(insectId);
				else $scope.selectedInsects.splice(index, 1);
			};
		};

		$scope.create = function() {
			var collection = new Collections({
				name: this.name,
				description: this.description,
				caught: $scope.selectedInsects
			});

			collection.$save(function(response){
				$location.path('collections/' + response._id);
				$scope.name = '';
				$scope.description = '';
				$scope.selectedInsects = [];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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

		$scope.updatePage = function() {
			// If user is not signed in then redirect back
			if (!$scope.authentication.user) $location.path('/collections');
			$scope.loading = true;
			$scope.insectModel = {};
			$scope.insects = [];
			$scope.selectedInsects = [];
			$scope.addInsect = function(insect) {
				var index = $scope.selectedInsects.indexOf(insect._id);
				if (index === -1) $scope.selectedInsects.push(insect._id);
				else $scope.selectedInsects.splice(index, 1);
			};

			$scope.collection = Collections.get({
				collectionId: $stateParams.collectionId
			}, function() {
				for (var i = 0; i < $scope.collection.caught.length; i++) {
					$scope.selectedInsects.push($scope.collection.caught[i]._id);
					$scope.insectModel[$scope.collection.caught[i]._id] = true;
				}
				$scope.insects = Insects.query({limit: 100}, function() {
					$scope.loading = false;
				});
			});
		};

		$scope.update = function() {
			var collection = new Collections({
				_id: $scope.collection._id,
				name: $scope.collection.name,
				description: $scope.collection.description,
				commentsEnabled: $scope.collection.commentsEnabled,
				caught: $scope.selectedInsects
			});

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

			// comments
			$scope.comment = {
				content: '',
				add: function() {
					$http.post('/collections/' + $scope.collection._id + '/comment/', {content: $scope.comment.content})
					.success(function(data, status, headers, config) {
						$state.go($state.$current, null, { reload: true });
					})
					.error(function(data, status, headers, config) {
						$scope.comment.error = data.message;
					});
				}
			};
		};
	}
]);
