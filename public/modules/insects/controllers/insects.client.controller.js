'use strict';

angular.module('insects').controller('InsectsController', ['$scope', '$upload', '$stateParams', '$location', '$modal', 'Authentication', 'Insects', 'GoogleMapApi'.ns(),
	function($scope, $upload, $stateParams, $location, $modal, Authentication, Insects, GoogleMapApi) {
		$scope.authentication = Authentication;

		$scope.gallerys = [
			{name: 'Poison Type'},
			{name: 'Bug Type'},
			{name: 'Flying Type'}
		];

		$scope.generatePDF = function() {
				var x = $scope.insect.location;
				console.log(x);
				var docDefinition = {
   						content: [
     					// if you don't need styles, you can use a simple string to define a paragraph
     					'This is a standard paragraph, using default style',

     					// using a { text: '...' } object lets you set styling properties
     					{ text: 'This paragraph will have a bigger font', fontSize: 15 },

     					// if you set pass an array instead of a string, you'll be able
     					// to style any fragment individually
     					{
       						text: [
         					'This paragraph is defined as an array of elements to make it possible to ',
         					{ text: 'restyle part of it and make it bigger ', fontSize: 15 },
         					'than the rest.'
       						]
     					}
   						]
				 };

				 	/*Downloads PDF*/
				// pdfMake.createPdf(docDefinition).download();
		};

		$scope.createPage = function() {
			$scope.form = {
				loc: {
					coordinates: {
						latitude: '',
						longitude: ''
					}
				},
				commentsEnabled: true,
				dateFound: new Date(),
				isValid: false,
				reviewForm: false,
				uploadingForm: false,
				progress: {
					current: 0,
					max: 100,
					type: 'info'
				},
				coordsSet: false,
				cancel: function() {
					$location.path('insects');
				}
			};

			// Map on create insect page
			$scope.map = {
				center: {
					latitude: 29.6398801,
					longitude: -82.3551082
				},
				zoom: 15,
				moveMarker: null,
				gmap: {},
				bounds: {},
				options: {
					scrollwheel: true,
					streetViewControl: false
				}/*,
				events: {
					click: function(map, eventName, args) {
						$scope.map.moveMarkerLatLng = args[0].latLng;
						$scope.map.moveMarker = setTimeout(function() {
							$scope.$apply(function(){
								console.log('run');
								$scope.marker.coords.latitude = $scope.map.moveMarkerLatLng.k;
								$scope.marker.coords.longitude = $scope.map.moveMarkerLatLng.B;
								$scope.map.gmap.refresh();
							});
						}, 200);
					},
					dblclick: function(event) {
						clearTimeout($scope.map.moveMarker);
					}
				}*/
			};

			$scope.marker = {
				id: 0,
				coords: {
					latitude: 29.6398801,
					longitude: -82.3551082
				},
				options: { draggable: true },
				events: {
					dragend: function (marker, eventName, args) {
						$scope.$apply(function() {
							$scope.form.loc.coordinates.latitude = marker.getPosition().lat();
							$scope.form.loc.coordinates.longitude = marker.getPosition().lng();
							$scope.form.coordsSet = true;
						});
					}
				}
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
		};

		$scope.create = function() {
			// Enable progress bar
			$scope.form.uploadingForm = true;
			$scope.form.progress.type = 'info';

			var insect = new Insects({
				name: this.form.name,
				scientificName: this.form.scientificName,
				description: this.form.description,
				dateFound: this.form.dateFound,
				commentsEnabled: this.form.commentsEnabled,
				locationTitle: this.form.locationTitle,
				loc: {
					coordinates: [this.form.loc.coordinates.longitude, this.form.loc.coordinates.latitude]
				}
			});

			$upload.upload({
				url: '/insects',
				method: 'POST',
				file: this.form.image,
				data: insect
			}).progress(function(evt) {
				$scope.form.progress.current = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function(response, status, headers, config) {
				$location.path('insects/' + response._id);

				// clear form if they make new insect
				$scope.form.name = '';
				$scope.form.scientificName = '';
				$scope.form.description = '';
				$scope.form.dateCreated = new Date();
				$scope.form.commentsEnabled = true;
				$scope.form.locationTitle = '';
				$scope.form.loc.coordinates.latitude = '';
				$scope.form.loc.coordinates.longitude = '';
				$scope.form.image = '';
				$scope.form.isValid = false;
				$scope.form.reviewForm = false;
				$scope.form.uploadingForm = false;
				$scope.form.progress.current = 0;
				$scope.form.progress.type = 'success';
				$scope.form.coordsSet = false;
			}).error(function(data, status, headers, config) {
				$scope.error = data.message;
				$scope.form.progress.current = 0;
				$scope.form.progress.type = 'warning';
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

		// List Insects Pages
		$scope.find = function() {
			$scope.insects = Insects.query();
		};

		// View Insect Page
		$scope.findOne = function() {
			$scope.insect = Insects.get({
				insectId: $stateParams.insectsId // issue with insect(s) here, investigate later
			}, function(insect){
				$scope.insectMap = {
					center: {
						latitude: insect.loc.coordinates[1],
						longitude: insect.loc.coordinates[0]
					},
					zoom: 15,
					bounds: {},
					options: {
						scrollwheel: true,
						streetViewControl: false
					}
				};

				$scope.insectMarker = {
					id: 0,
					coords: {
						latitude: insect.loc.coordinates[1],
						longitude: insect.loc.coordinates[0]
					},
					options: {draggable: false}
				};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
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

		// Edit Insect Page
		$scope.findOneEdit = function() {
			$scope.insect = Insects.get({
				insectId: $stateParams.insectsId
			});
		};

		// Update insect
		$scope.update = function() {
			var insect = new Insects({
				_id: $scope.insect._id,
				name: $scope.insect.name,
				scientificName: $scope.insect.scientificName,
				description: $scope.insect.description,
				commentsEnabled: $scope.insect.commentsEnabled,
				locationTitle: $scope.insect.locationTitle,
			});

			insect.$update(function() {
				$location.path('insects/' + insect._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Area Page
		$scope.lookup = function() {
			$scope.insect = Insects.get({
				insectId: $stateParams.insectsId
			});

			$scope.map = {
				center: {
					latitude: 29.6398801,
					longitude: -82.3551082
				},
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true,
					streetViewControl: false
				}
			};

			$scope.marker = {
				id: 0,
				coords: {
					latitude: 29.6398801,
					longitude: -82.3551082
				},
				options: { draggable: true },
				events: {
					dragend: function (marker, eventName, args) {
						$scope.form.loc.coordinates.latitude = marker.getPosition().lat();
						$scope.form.loc.coordinates.longitude = marker.getPosition().lng();
						$scope.form.coordsSet = true;
						$scope.$apply();
					}
				}
			};
		};
	}
]);
