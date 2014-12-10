'use strict';

angular.module('groups').controller('GroupsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Groups', 'Insects',
	function($scope, $http, $stateParams, $location, Authentication, Groups, Insects) {
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

		$scope.findGroup = function() {
			$scope.loading = true;

			$scope.groups = Groups.query({
				type: 'Group'
			}, function() {
				$scope.loading = false;
			}, function(err) {
				$scope.loading = false;
				$scope.error = err.data.message;
			});
		};

		$scope.findClass = function() {
			$scope.loading = true;

			$scope.groups = Groups.query({
				type: 'Class'
			}, function() {
				$scope.loading = false;
			}, function(err) {
				$scope.loading = false;
				$scope.error = err.data.message;
			});
		};

		$scope.findOne = function() {
			$scope.loading = true;

			Groups.get({
				groupId: $stateParams.groupId
			}, function(data) {
				$scope.loading = false;
				$scope.group = data.data;
				$scope.membersList = data.membersList;
				$scope.insects = data.insects;
				$scope.collections = data.collections;
			}, function(err) {
				$scope.loading = false;
				$scope.error = err.data.message;
			});
		};

		$scope.addMember = function() {
			var group = $scope.group;
			group.members.push(this.member);
			group.$update(function() {
				$location.path('groups/' + group._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.joinGroup = function() {
			var group = $scope.group;
			var isMember = false;
			for(var i = 0; i < group.members.length; i++) {
				 if (group.members[i]._id === $scope.authentication.user._id) isMember = true;
			}

			if(!isMember)
				group.members.push($scope.authentication.user);

			group.$joinGroup(function() {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find2 = function() {
				var slides = $scope.slides = [10];
				$scope.insects = Insects.query();

		};

		$scope.leaveGroup = function() {
			var group = $scope.group;
			for(var i = 0; i < group.members.length; i++)
			{
				 if(group.members[i]._id === $scope.authentication.user._id)
				 	group.members.splice(i, 1);

			}

			group.$joinGroup(function() {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.showPath = function(path) {
			$location.path(path);
		};
	}
]);
