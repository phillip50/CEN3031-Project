'use strict';


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
				$scope.phones = [
		    {'name': 'Nexus S',
		     'snippet': 'Fast just got faster with Nexus S.'},
		    {'name': 'Motorola XOOM™ with Wi-Fi',
		     'snippet': 'The Next, Next Generation tablet.'},
		    {'name': 'MOTOROLA XOOM™',
		     'snippet': 'The Next, Next Generation tablet.'}
	  	];
	}
]);
