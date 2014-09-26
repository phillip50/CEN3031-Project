'use strict';
/* FINDME */

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.map = {
			center: {
				latitude: 29.6398801,
				longitude: -82.3551082
			},
			zoom: 14,
			bounds: {},
			options: {
				scrollwheel: true,
				streetViewControl: false
			}
		};
		/*$scope.marker = {
			id: 0,
			icon:
			coords: {
				latitude: 29.6398801,
				longitude: -82.3551082
			},
			options: {draggable: true},
			events: {
				dragend: function (marker, eventName, args) {
					console.log('marker dragend: lat ' + marker.getPosition().lat() + ', lng ' + marker.getPosition().lng());
				}
			}
		};*/

		$scope.markersEvents = {
			dragend: function (gMarker, eventName, model) {
				if (model.$id){
					model = model.coords;//use scope portion then
				}
				console.log("Model: event:" + eventName + " " + JSON.stringify(model));
			}
		};

		var createRandomMarker = function (i, bounds, bug, idKey) {
            if (idKey == null) idKey = "id";
			var ret = {
				options: {
					draggable: false,
					labelAnchor: '10 39',
					labelContent: i,
					labelClass: 'labelMarker'
				},
				latitude: bug.coords.latitude,
				longitude: bug.coords.longitude,
				title: bug.name,
				caughtBy: bug.caughtBy,
				location: bug.location
				//icon: bug.pic
			};
			ret.onClick = function() {
				ret.show = !ret.show;
			};
            ret[idKey] = i;
            return ret;
        };

		$scope.randomMarkers = [];

		// Get the bounds from the map once it's loaded
		$scope.$watch(function() { return $scope.map.bounds; }, function(nv, ov) {
			// Only need to regenerate once
			// Create 25 markes with label, 25 without.
			if (!ov.southwest && nv.southwest) {
				var markers = [];
				for (var i = 0; i < $scope.sample_bugs.length; i++) {
					markers.push(createRandomMarker(i, $scope.map.bounds, $scope.sample_bugs[i]));
				}
				$scope.randomMarkers = markers;
			}
		}, true);

		// Test data
		$scope.sample_bugs = [{
			id: 0,
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
			name: 'Galvantula',
			pic: 'bug5.png',
			caughtBy : 'Jessie',
			location : 'Nowhere',
			coords: {
				latitude: 29.6328801,
				longitude: -82.3511082
			}
		}];
	}
]);
