'use strict';

angular.module('insects').controller('InsectsController', ['$scope', '$http', '$upload', '$stateParams', '$location', 'Authentication', 'Insects', 'GoogleMapApi'.ns(),
	function($scope, $http, $upload, $stateParams, $location, Authentication, Insects, GoogleMapApi) {
		$scope.authentication = Authentication;

		$scope.gallerys = [
			{name: 'Poison Type'},
			{name: 'Bug Type'},
			{name: 'Flying Type'}
		];
		$scope.addGallery = function(gallery) {
			var newG = {name: gallery};
			$scope.gallerys.push(newG);
		};

		$scope.createPage = function() {
			// If user is not signed in then redirect back
			if (!$scope.authentication.user) $location.path('/insects');

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
					type: 'info',
					task: 'Uploading',
					active: true
				},
				coordsSet: false,
				cancel: function() {
					$location.path('insects');
				},
				reset: function() {
					$scope.form.progress.current = 0;
					$scope.form.reviewForm = false;
					$scope.form.uploadingForm = false;
					$scope.form.progress.active = true;
					$scope.form.progress.task = 'Uploading';
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
			$scope.form.reviewForm = false;
			$scope.form.uploadingForm = true;
			$scope.form.progress.type = 'info';

			var insect = new Insects({
				name: this.form.name,
				galleryName: this.form.galleryName,
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
				$scope.form.progress.current = parseInt(75 * evt.loaded / evt.total, 10);
				if ($scope.form.progress.current === 75) $scope.form.progress.task = 'Processing';
			}).success(function(response, status, headers, config) {
				$scope.form.progress.current = 100;
				$location.path('insects/' + response._id);

				// clear form if they make new insect
				$scope.form.name = '';
				$scope.form.galleryName = '';
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
				$scope.form.progress.active = false;
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
			$scope.updateGallery = function() {
				console.log($scope.insects[this.$index]);
				$scope.insect = $scope.insects[this.$index];
				console.log(this.insect.galleryName.name);
				var insect = new Insects({
					_id: $scope.insect._id,
					name: $scope.insect.galleryName.name,
					scientificName: $scope.insect.scientificName,
					description: $scope.insect.description,
					commentsEnabled: $scope.insect.commentsEnabled,
					locationTitle: $scope.insect.locationTitle,
					galleryName: $scope.insect.galleryName.name
				});
				console.log($scope.insect.galleryName.name);
				insect.$update(function() {
					$location.path('insects');
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
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

			$scope.insectDownload = function(size) {
				$http.get('/insects/' + $scope.insect._id + '/download/' + size)
				.success(function(data, status, headers, config) {
					window.open(data);
					//document.location.href = data;
			  	})
				.error(function(data, status, headers, config) {
				    $scope.error = data.message;
				});
			};

			$scope.generatePDF = function() {
				var docDefinition = {
					content: [
					{text: 'Insect Guide', style: 'header'},
					{
						style: 'table',
						table: {
							widths: [200, '*'],
							body: [
								[
									{text: 'Photo', style: 'tableHeader'},
									{text: 'Infomation', style: 'tableHeader'}
								], [
									{image: $scope.insect.image.large, width: 200},
									{
										table: {
											body: [
												[{text: 'Name', bold: true}, $scope.insect.name],
												[{text: 'Scientific Name', bold: true}, $scope.insect.scientificName],
												[{text: 'Description', bold: true}, $scope.insect.description],
												[{text: 'Caught By', bold: true}, $scope.insect.user.displayName],
												[{text: 'Date Found', bold: true}, $scope.insect.dateFound],
												[{text: 'Location Found', bold: true}, $scope.insect.locationTitle],
												[{text: 'Coordinates', bold: true}, $scope.insect.loc.coordinates[0] + ', ' + $scope.insect.loc.coordinates[1]]
											],
										},
										layout: 'noBorders'
									}
									//{text: 'nothing interesting here', italics: true, color: 'gray'}
								]
							]
						},
						layout: 'lightHorizontalLines',
						pageBreak: 'before'
					}],
					styles: {
						header: {
							fontSize: 18,
							bold: true,
							margin: [0, 0, 0, 10]
						},
						subheader: {
							fontSize: 16,
							bold: true,
							margin: [0, 10, 0, 5]
						},
						table: {
							margin: [0, 5, 0, 15]
						},
						tableHeader: {
							bold: true,
							fontSize: 13,
							color: 'black'
						}
					}
				};

				// Open PDF
				pdfMake.createPdf(docDefinition).open();
			};

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

		// Map Page
		$scope.lookup = function() {
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
					scrollwheel: true,
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
						latitude: insect.loc.coordinates[1],
						longitude: insect.loc.coordinates[0],
						options: {
							icon: {
								url: insect.image.small,
								scaledSize: new google.maps.Size(50, 50)
							}
						},
						title: insect.name,
						caughtBy: insect.user.displayName,
						location: insect.locationTitle
					};
					return marker;
				};

				Insects.query(function(insects) {
					for (var i = 0; i < insects.length; i++) {
						markersTemp.push(markers(i, insects[i]));
					}
				});

				$scope.markers = markersTemp;
			});
		};
	}
]);
