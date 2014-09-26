'use strict';

//Insects service used for communicating with the insects REST endpoints
angular.module('insects').factory('Insects', ['$resource',
	function($resource) {
		return $resource('insects/:insectId', {
			insectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
