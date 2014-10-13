'use strict';

// Setting up route
angular.module('gallerys').config(['$stateProvider',
	function($stateProvider) {
		// Gallerys state routing
		$stateProvider.
		state('listGallerys', {
			url: '/gallerys',
			templateUrl: 'modules/gallerys/views/list-gallerys.client.view.html'
		}).
		state('createGallery', {
			url: '/gallerys/create',
			templateUrl: 'modules/gallerys/views/create-gallery.client.view.html'
		}).
		state('viewGallery', {
			url: '/gallerys/:galleryId',
			templateUrl: 'modules/gallerys/views/view-gallery.client.view.html'
		}).
		state('editGallery', {
			url: '/gallerys/:galleryId/edit',
			templateUrl: 'modules/gallerys/views/edit-gallery.client.view.html'
		});
	}
]);