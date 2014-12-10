'use strict';

// Configuring the menus
angular.module('users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Users', 'users', 'dropdown', '/users(/list)?', false, null, 10);
		Menus.addSubMenuItem('topbar', 'users', 'All Users', 'users/list',null, true, null, null,'See all bug collectors');
		Menus.addSubMenuItem('topbar', 'users', 'My Profile', 'profile/',null, true, null, null,'About you');
	}
]);

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
