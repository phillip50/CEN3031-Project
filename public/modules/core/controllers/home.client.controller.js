'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Insects', 'uiGmapGoogleMapApi', 'Authentication',
	function($scope, $location, Insects, GoogleMapApi, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		// Number of insects counter
		Insects.get({count: 1}, function(data) {
			$scope.totalInsects = data.count;
		});

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
					id: insect._id,
					latitude: insect.loc.coordinates[1],
					longitude: insect.loc.coordinates[0],
					options: {
						icon: {
            				url: insect.image.small,
            				scaledSize: new google.maps.Size(50, 50)
        				}
    				},
					name: insect.name,
					scientificName: insect.scientificName,
					user: insect.user,
					dateFound: insect.dateFound,
					locationTitle: insect.locationTitle
				};
				return marker;
			};

			Insects.query({limit: 10}, function(insects) {
				for (var i = 0; i < insects.length; i++) {
					markersTemp.push(markers(i, insects[i]));
				}
			});

			$scope.markers = markersTemp;
		});
	}
]);
