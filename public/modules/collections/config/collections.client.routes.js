'use strict';

// Setting up route
angular.module('collections').config(['$stateProvider',
	function($stateProvider) {
		// Collections state routing
		$stateProvider.
		state('listCollections', {
			url: '/collections',
			templateUrl: 'modules/collections/views/list-collections.client.view.html'
		}).
		state('createCollection', {
			url: '/collections/create',
			templateUrl: 'modules/collections/views/create-collection.client.view.html'
		}).
		state('viewCollection', {
			url: '/collections/:collectionId',
			templateUrl: 'modules/collections/views/view-collection.client.view.html'
		}).
		state('editCollection', {
			url: '/collections/:collectionId/edit',
			templateUrl: 'modules/collections/views/edit-collection.client.view.html'
		});
	}
]);