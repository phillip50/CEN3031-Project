'use strict';

//Collections service used for communicating with the collections REST endpoints
angular.module('collections').factory('Collections', ['$resource',
	function($resource) {
		return $resource('collections/:collectionId', {
			collectionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);