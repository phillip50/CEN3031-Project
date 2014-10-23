'use strict';

angular.module('groups').controller('GroupsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Groups',
	function($scope, $http, $stateParams, $location, Authentication, Groups) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var group = new Groups({
				name: this.name,
				description: this.description,
				type: this.type
			});
			group.$save(function(response) {
				$location.path('groups/' + response._id);

				$scope.name = '';
				$scope.description = '';
				$scope.type = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(group) {
			if (group) {
				group.$remove();

				for (var i in $scope.groups) {
					if ($scope.groups[i] === group) {
						$scope.groups.splice(i, 1);
					}
				}
			} else {
				$scope.group.$remove(function() {
					$location.path('groups');
				});
			}
		};

		$scope.update = function() {
			var group = $scope.group;

			group.$update(function() {
				$location.path('groups/' + group._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.groups = Groups.query();
		};

		$scope.findOne = function() {
			$scope.group = Groups.get({
				groupId: $stateParams.groupId
			});
		};

		$scope.joinGroup = function() {
			var group = $scope.group;

			group.$joinGroup(function() {
				//$location.path('groups/' + group._id);
				// Add user to members
				//$location.path('groups/' + group._id);
				//$scope.group.members.push(Authentication.user);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			/*$http.post('groups/' + group._id, {action: 'joinGroup', id: Authentication.user._id}).success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
			}).error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});*/
		};

		$scope.showPath = function(path) {
			$location.path(path);
		};
	}
]);
