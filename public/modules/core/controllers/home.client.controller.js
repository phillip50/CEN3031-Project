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

		$scope.markersEvents = {
			dragend: function (gMarker, eventName, model) {
				if (model.$id){
					model = model.coords;//use scope portion then
				}
				console.log('Model: event:' + eventName + ' ' + JSON.stringify(model));
			}
		};

      	var createRandomMarker = function (i, bounds, bug, idKey) {
            var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;
            // Note, the label* properties are only used if isLabel='true' in the directive.
			var ret = {
				id: i,
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
			return ret;
        };
        $scope.randomMarkers = [];

		// Get the bounds from the map once it's loaded
		$scope.$watch(function() { return $scope.map.bounds; }, function() {
			var markers = [];
			for (var i = 0; i < $scope.sample_bugs.length; i++) {
				markers.push(createRandomMarker(i, $scope.map.bounds, $scope.sample_bugs[i]));
			}
			$scope.randomMarkers = markers;
		}, true);

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
