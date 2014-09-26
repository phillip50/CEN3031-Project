'use strict';
/* FINDME */

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.map = {
			center: {
				latitude: 40.1451,
				longitude: -99.6680
			},
			zoom: 8
		};
		$scope.marker = {
            id:0,
            coords: {
                latitude: 40.1451,
                longitude: -99.6680
            },
            options: { draggable: true },
            
		};
		$scope.sample_bugs = [
		    {'name': 'Butterfry',
		    'caughtBy' : 'Ash',
		    'location' : 'Pallet Town',
		     'pic': 'bug1.png'},
		    {'name': 'Ledyba',
		    'caughtBy' : 'Bugsy',
		    'location' : 'Gainesville',
		     'pic': 'bug2.jpg'},
		    {'name': 'Caterpie',
		    'caughtBy' : 'Brock',
		    'location' : 'Hawaii',
		     'pic': 'bug3.png'},
		    {'name': 'Weedle',
		    'caughtBy' : 'Misty',
		    'location' : 'Somewhere',
		     'pic': 'bug4.jpg'},
		    {'name': 'Galvantula',
		    'caughtBy' : 'Jessie',
		    'location' : 'Nowhere',
		     'pic': 'bug5.png'}
	  	];
	}
]);
