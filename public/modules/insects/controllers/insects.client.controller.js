'use strict';

angular.module('insects').controller('InsectsController', ['$state', '$scope', '$http', '$upload', '$stateParams', '$location', 'Authentication', 'Insects', 'uiGmapGoogleMapApi',
	function($state, $scope, $http, $upload, $stateParams, $location, Authentication, Insects, GoogleMapApi) {
		$scope.authentication = Authentication;

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
				validationEnabled: true,
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
				validationEnabled: this.form.validationEnabled,
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
				$scope.form.validationEnabled = true;
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
			$scope.loading = true;

			// Skip insects for pagination
			var skip = 0;
			if ($stateParams.hasOwnProperty('skip') && parseInt($stateParams.skip, 10) >= 0) skip = parseInt($stateParams.skip, 10);

			function fetch(skip, firstRun) {
				$scope.loading = true;

				// If finding a user's insects
				if ($stateParams.hasOwnProperty('userId')) {
					//if (skip == 0) $location.path('insects/user/' + $stateParams.userId, false);
					//else $location.path('insects/user/' + $stateParams.userId + '/skip/' + skip, false);

					$scope.insects = Insects.query({
						userId: $stateParams.userId,
						skip: skip
					}, function() {
						$scope.loading = false;
					});

					// Get total count
					Insects.get({userId: $stateParams.userId, count: 1}, function(data) {
						$scope.foundUser = data.user;
						$scope.pagination.totalItems = data.count;
					});
				}
				// List all insects
				else {
					//if (skip == 0) $location.path('insects', false);
					//else $location.path('insects/skip/' + skip, false);

					$scope.insects = Insects.query({
						limit: 12,
						skip: skip
					}, function() {
						$scope.loading = false;
					});

					// Get total count
					Insects.get({count: 1}, function(data) {
						$scope.count = data;
						$scope.pagination.totalItems = data.count;
						if (firstRun) $scope.pagination.currentPage = parseInt((skip / data.count) * 12, 10);
					});
				}
			}

			fetch(skip, true);

			$scope.pagination = {
				totalItems: 0,
				currentPage: 0,
				itemsPerPage: 12,
				pageChanged: function(page) {
					fetch(($scope.pagination.currentPage - 1) * 12);
				}
			};
		};

		// View Insect Page
		$scope.findOne = function() {
			$scope.loading = true;

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

				$scope.loading = false;
			}, function(errorResponse) {
				//$scope.error = errorResponse.data.message;
				$scope.insect404 = true;
				$scope.loading = false;
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
						layout: 'lightHorizontalLines'
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
				pdfMake.createPdf(docDefinition).download();
			};

			// comments
			$scope.comment = {
				content: '',
				add: function() {
					$http.post('/insects/' + $scope.insect._id + '/comment/', {content: $scope.comment.content})
					.success(function(data, status, headers, config) {
						$state.go($state.$current, null, { reload: true });
					})
					.error(function(data, status, headers, config) {
						$scope.comment.error = data.message;
					});
				}
			};
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
		$scope.map = function() {
			// If finding a user's insects
			if ($stateParams.hasOwnProperty('userId')) {
				// Get total count
				Insects.get({userId: $stateParams.userId, count: 1}, function(data) {
					$scope.foundUser = data.user;
				});
			}

			// Display insects on map
			$scope.map = {
				center: {
					latitude: 29.6398801,
					longitude: -82.3551082
				},
				zoom: 16,
				gmap: null,
				bounds: {},
				options: {
					scrollwheel: true,
					streetViewControl: false
				}
			};
			$scope.markers = [];
			$scope.markersIds = [];

			// Ready to manipulate map
			GoogleMapApi.then(function(maps) {
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

				$scope.$watch(function() { return $scope.map.bounds; }, function(nv, ov) {
					$scope.loading = true;

					var markersTemp = [],
						markersIdsTemp = [];

					if (!ov.southwest && nv.southwest || ov.southwest && nv.southwest) {
						var boxBounds = {
							bounds: {
								southwest: [$scope.map.bounds.southwest.longitude, $scope.map.bounds.southwest.latitude],
								northeast: [$scope.map.bounds.northeast.longitude, $scope.map.bounds.northeast.latitude]
							},
							fetched: JSON.stringify($scope.markersIds),
							limit: 50
						};

						// If finding a user's insects
						if ($stateParams.hasOwnProperty('userId')) boxBounds.userId = $stateParams.userId;

						Insects.query(boxBounds, function(insects) {
							for (var i = 0; i < insects.length; i++) {
								// throw out duplicates already on map
								if ($scope.markersIds.indexOf(insects[i]._id) === -1) {
									markersTemp.push(markers(i, insects[i]));
									markersIdsTemp.push(insects[i]._id);
								}
							}

							$scope.markers = $scope.markers.concat(markersTemp);
							$scope.markersIds = $scope.markersIds.concat(markersIdsTemp);
							$scope.loading = false;
						});
					}
				}, true);
			});
		};
	}
]);
