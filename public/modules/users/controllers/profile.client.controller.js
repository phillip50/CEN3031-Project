'use strict';

angular.module('users').controller('ProfileController', ['$scope', '$http', '$stateParams', '$location', 'Users', 'Authentication',
	function($scope, $http, $stateParams, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		$scope.findUser = function() {
			// If bare URL with no userid, find logged in profile
			var userId = $stateParams.userId;
			if ($stateParams.userId === '') userId = Authentication.user._id;

			$scope.foundUser = Users.get({
				userId: userId
			});
		};
	}
]);
