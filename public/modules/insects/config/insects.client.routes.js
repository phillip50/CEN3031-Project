'use strict';

// Setting up route
angular.module('insects').config(['$stateProvider',
	function($stateProvider) {
		// Insects state routing
		$stateProvider.
		state('listInsects', {
			url: '/insects',
			templateUrl: 'modules/insects/views/list-insects.client.view.html'
		}).
		state('createInsect', {
			url: '/insects/create',
			templateUrl: 'modules/insects/views/create-insect.client.view.html'
		}).
		state('viewInsect', {
			url: '/insects/:insectsId',
			templateUrl: 'modules/insects/views/view-insect.client.view.html'
		}).
		state('editInsect', {
			url: '/insects/:insectsId/edit',
			templateUrl: 'modules/insects/views/edit-insect.client.view.html'
		});
	}
]);
