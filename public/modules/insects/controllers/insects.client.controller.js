'use strict';

angular.module('insects').controller('InsectsController', ['$scope', '$upload', '$http', '$stateParams', '$location', '$modal', 'Authentication', 'Insects',
	function($scope, $upload, $http, $stateParams, $location, $modal, Authentication, Insects) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var insect = new Insects({
				name: this.form.name,
				scientificName: this.form.scientificName,
				description: this.form.description,
				dateFound: this.form.dateFound,
				commentsEnabled: this.form.commentsEnabled,
				location: this.form.location
			});

			$upload.upload({
				url: '/insects',
				method: 'POST',
				file: this.form.image,
				data: insect
			}).success(function(response, status, headers, config) {
				$location.path('insects/' + response._id);

				// clear form if they make new insect
				$scope.form.name = '';
				$scope.form.scientificName = '';
				$scope.form.description = '';
				$scope.form.dateCreated = new Date();
				$scope.form.commentsEnabled = true;
				$scope.form.location.title = '';
				$scope.form.location.coordinates.latitude = '';
				$scope.form.location.coordinates.longitude = '';
				$scope.form.image = '';
				$scope.form.isValid = false;
				$scope.form.reviewForm = false;
				$scope.form.coordsSet = false;
			}).error(function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.form = {
			location: {
				coordinates: {
					latitude: '',
					longitude: ''
				}
			},
			commentsEnabled: true,
			dateFound: new Date(),
			isValid: false,
			reviewForm: false,
			coordsSet: false,
			cancel: function() {
				$location.path('insects');
			},
			photoPreview: function() {
				if ($scope.form.photoUpload.files && $scope.form.photoUpload.files[0]) {
					var reader = new FileReader();

					reader.onload = function(e) {
                		$scope.form.photoPreviewUrl = e.target.result;
            		}

            		reader.readAsDataURL($scope.form.photoUpload.files[0]);
				}
			}
		};

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
					$scope.form.location.coordinates.latitude = marker.getPosition().lat();
					$scope.form.location.coordinates.longitude = marker.getPosition().lng();
					$scope.form.coordsSet = true;
					$scope.$apply();
				}
			}
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
				insectId: $stateParams.insectsId // issue with insect(s) here, investigate later
			});

			/*comments: [{
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
				}]*/

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
				coords: {
					latitude: 29.631146633445802,
					longitude: -82.34787039550469
				},
				options: {draggable: false}
			};

			/* For confirm to delete
			$scope.comfirmRemove = function() {
				var modalInstance = $modal.open({
					templateUrl: 'confirmRemove.html',
					controller: 'InsectsController',
					resolve: {
						insect: function() {
							return $scope.insect;
						},
        				remove: function() {
							return $scope.remove;
    					}
					}
				});

				modalInstance.result.then(function() {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};

			$scope.ok = function() {
				 console.log('close');
				$modalInstance.close();
				$scope.remove();
			};

			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};*/
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
	}
]);
