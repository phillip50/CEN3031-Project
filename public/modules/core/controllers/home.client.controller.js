'use strict';
/* FINDME */
/* global google */

angular.module('core').controller('HomeController', ['$scope', '$location', 'GoogleMapApi'.ns(), 'Authentication',
	function($scope, $location, GoogleMapApi, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		// Display insects on map
		$scope.map = {
			center: {
				latitude: 29.6398801,
				longitude: -82.3551082
			},
			zoom: 15,
			gmap: null,
			bounds: {},
			options: {
				scrollwheel: false,
				streetViewControl: false
			}
		};
		$scope.markers = [];

		// Ready to manipulate map
		GoogleMapApi.then(function(maps) {
			var markersTemp = [];
			var markers = function(i, insect) {
				var marker = {
					id: i,
					latitude: insect.coords.latitude,
					longitude: insect.coords.longitude,
					options: {
						icon: {
            	url: '/images/' + insect.pic,
            	scaledSize: new google.maps.Size(50, 50)
        		}
    			},
					title: insect.name,
					caughtBy: insect.caughtBy,
					location: insect.location
				};
				return marker;
			};

			for (var i = 0; i < $scope.sample_bugs.length; i++) {
				markersTemp.push(markers(i, $scope.sample_bugs[i]));
			}
			$scope.markers = markersTemp;
		});

		// Test data
		$scope.sample_bugs = [{
			id: 0,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Butterfry',
			pic: 'bug1.png',
			caughtBy : 'Ash',
			location : 'Pallet Town',
			coords: {
				latitude: 29.631146633445802,
				longitude: -82.34787039550469
			}
		}, {
			id: 1,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Ledyba',
			pic: 'bug2.jpg',
			caughtBy : 'Bugsy',
			location : 'Gainesville',
			coords: {
				latitude: 29.64261231,
				longitude: -82.348432409
			}
		}, {
			id: 2,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Caterpie',
			pic: 'bug3.png',
			caughtBy : 'Brock',
			location : 'Hawaii',
			coords: {
				latitude: 29.6328801,
				longitude: -82.3521082
			}
		}, {
			id: 3,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Weedle',
			pic: 'bug4.jpg',
			caughtBy : 'Misty',
			location : 'Somewhere',
			coords: {
				latitude: 29.6308801,
				longitude: -82.3451082
			}
		}, {
			id: 4,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Galvantula',
			pic: 'bug5.png',
			caughtBy : 'Jessie',
			location : 'Nowhere',
			coords: {
				latitude: 29.6368801,
				longitude: -82.3531082
			}
		}, {
			id: 5,
			articleId: '5425cdf5806e219804c442cf',
			name: 'Combee',
			pic: 'combee.png',
			caughtBy : 'James',
			location : 'Nowhere',
			coords: {
				latitude: 29.643162438647163,
				longitude: -82.36231797783205
			}
		}];
	}
]);
