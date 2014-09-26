'use strict';
/* FINDME */

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.map = {
			center: {
				latitude: 45,
				longitude: -73
			},
			zoom: 8
		};
		$scope.sample_bugs = [
		    {'name': 'Butterfry',
		     'pic': 'bug1.png'},
		    {'name': 'Ledyba',
		     'pic': 'bug2.jpg'},
		    {'name': 'Caterpie',
		     'pic': 'bug3.png'},
		    {'name': 'Weedle',
		     'pic': 'bug4.jpg'},
		    {'name': 'Galvantula',
		     'pic': 'bug5.png'}
	  	];
	}
]);
