'use strict';

//Insects service used for communicating with the insects REST endpoints
angular.module('galleries').factory('galleries', ['$resource',
	function($resource) {
		return $resource('galleries/:galleriesId', {
			galleriesId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
