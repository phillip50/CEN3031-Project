'use strict';

// Setting up route
angular.module('galleries').config(['$stateProvider',
	function($stateProvider) {
		// Insects state routing
		$stateProvider.
		state('listGalleries', {
			url: '/galleries',
			templateUrl: 'modules/galleries/views/list-galleries.client.view.html'
		}).
		state('createGalleries', {
			url: '/galleries/create',
			templateUrl: 'modules/galleries/views/create-galleries.client.view.html'
		}).
		state('viewGalleries', {
			url: '/galleries/:galleriesId',
			templateUrl: 'modules/galleries/views/view-galleries.client.view.html'
		}).
		state('editGalleries', {
			url: '/galleries/:GalleriesId/edit',
			templateUrl: 'modules/galleries/views/edit-galleries.client.view.html'
		});
	}
]);
