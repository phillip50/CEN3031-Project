'use strict';

//Gallerys service used for communicating with the gallerys REST endpoints
angular.module('gallerys').factory('Gallerys', ['$resource',
	function($resource) {
		return $resource('gallerys/:galleryId', {
			galleryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);