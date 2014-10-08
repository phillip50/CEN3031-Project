'use strict';

angular.module('insects').controller('InsectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Insects',
	function($scope, $stateParams, $location, Authentication, Insects) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var insect = new Insects({
				title: this.title,
				content: this.content
			});
			insect.$save(function(response) {
				$location.path('insects/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.form = function() {
			$scope.next = function() {
				console.log('next');
			};
		};

		$scope.remove = function(insect) {
			if (insect) {
				insect.$remove();

				for (var i in $scope.insects) {
					if ($scope.insects[i] === insect) {
						$scope.insects.splice(i, 1);
					}
				}
			} else {
				$scope.insect.$remove(function() {
					$location.path('insects');
				});
			}
		};

		$scope.update = function() {
			var insect = $scope.insect;

			insect.$update(function() {
				$location.path('insects/' + insect._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// List Insects Pages
		$scope.find = function() {
			$scope.insects = Insects.query();
		};

		// View Insect Page
		$scope.findOne = function() {
			$scope.insect = Insects.get({
				insectId: $stateParams.insectId
			});

			$scope.sampleInsect = {
				_id: 0,
				name: 'Butterfree',
				scientificName: 'Rhopalocera Liberum',
				description: 'It loves the honey of flowers and can locate flower patches that have even tiny amounts of pollen.',
				pic: 'bug1.png',
				caughtBy : { // user object
					_id: 'AshID',
					displayName: 'Ash'
				},
				date: '2014-09-29T18:46:39.936Z',
				location: 'Pallet Town',
				coords: {
					latitude: 29.631146633445802,
					longitude: -82.34787039550469
				},
				comments: [{
					user: {
						_id: 1,
						displayName: 'Student 1'
					},
					created: '2014-09-29T18:46:39.936Z',
					message: 'I call it "frying butter".'
				}, {
					user: {
						_id: 2,
						displayName: 'Student 2'
					},
					created: '2014-10-01T18:46:39.936Z',
					message: 'I already took that'
				}, {
					user: {
						_id: 3,
						displayName: 'Prof'
					},
					created: '2014-10-02T18:46:39.936Z',
					message: 'Wow, it\'s so small! I think Butterfree is better overall. It learns a couple of useful status-hindering attacks and learns a few Psychic-type attacks like Psybeam and Confusion. Butterfree has a better move pool the Beedrill. However Beedrill has overall better stats then Butterfree.'
				}]
			};

			// map
			$scope.sampleMap = {
				center: {
					latitude: 29.631146633445802,
					longitude: -82.34787039550469
				},
				zoom: 14,
				bounds: {},
				options: {
					scrollwheel: true,
					streetViewControl: false
				}
			};
			$scope.sampleMarker = {
				id: 0,
				coords: $scope.sampleInsect.coords,
				options: {draggable: false},
				events: {
					dragend: function (marker, eventName, args) {
						console.log({latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()});
						document.getElementsByName('locationCoordinates').value = JSON.stringify({latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()});
					}
				}
			};
		};

		// Datepicker
		$scope.datePicker = {
			options: {
				formatYear: 'yyyy',
				startingDay: 0
			},
			format: 'MMMM d, yyyy',
			minDate: null,
			maxDate: new Date(),
			clear: function() {
				$scope.dt = null;
			},
			open: function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.datePicker.opened = true;
			}
		};
		$scope.dt = new Date();

		// map
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

		$scope.coords = 'cats';

		$scope.marker = {
            id:0,
            coords: {
				latitude: 29.6398801,
				longitude: -82.3551082
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    console.log($scope.coords = marker.getPosition().lat() + ' ' + marker.getPosition().lng());// = 'loc set';// marker.getPosition().lat() + ' ' + marker.getPosition().lng();
					console.log({latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()});
				}
            }
        };
	}
]);
