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

		$scope.find = function() {
			$scope.insects = Insects.query();
		};

		$scope.findOne = function() {
			$scope.insect = Insects.get({
				insectId: $stateParams.insectId
			});
		};


		// Datepicker
		$scope.today = function() {
			$scope.dt = new Date();
  		};
		$scope.today();

 		$scope.clear = function () {
			$scope.dt = null;
 		};

		// Disable weekend selection
		$scope.disabled = function(date, mode) {
			return; //( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		};

		$scope.open = function($event) {
		    $event.preventDefault();
		   	$event.stopPropagation();
		    $scope.opened = true;
		};

		$scope.dateOptions = {
		   	formatYear: 'yyyy',
		    startingDay: 0
		};

		$scope.format = 'MMMM dd, yyyy';
		$scope.minDate = null;
		$scope.maxDate = $scope.dt;

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
		$scope.marker = {
            id:0,
            coords: {
				latitude: 29.6398801,
				longitude: -82.3551082
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    console.log({latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()});
					document.getElementsByName('locationCoordinates').value = JSON.stringify({latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()});
                }
            }
        };
	}
]);
