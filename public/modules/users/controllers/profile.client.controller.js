'use strict';

angular.module('users').controller('ProfileController', ['$scope', '$http', '$stateParams', '$location', 'Users', 'Collections', 'Authentication',
	function($scope, $http, $stateParams, $location, Users, Collections, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		//if (!$scope.user) $location.path('/');

		$scope.showPath = function(path) {
			$location.path(path);
		};

		$scope.listUsers = function() {
			$http.get('/users/list')
			.success(function(data, status, headers, config) {
				$scope.users = data;
			})
			.error(function(data, status, headers, config) {
				$scope.error = data.message;
			});
		};

		$scope.findUser = function() {
			$scope.loading = true;
			$scope.collectionsloading = true;

			// If bare URL with no userid, find logged in profile
			var userId = $stateParams.userId;
			if ($stateParams.userId === '') userId = Authentication.user._id;

			$scope.foundUser = Users.get({
				userId: userId
			}, function() {
				$scope.loading = false;
			});

			$scope.collections = Collections.query({
				userId: userId
			}, function() {
				$scope.collectionsloading = false;
			});
		};
	}
]);
