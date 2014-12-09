'use strict';

angular.module('notes').controller('NotesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notes', 'Insects',
	function($scope, $stateParams, $location, Authentication, Notes, Insects) {
		$scope.authentication = Authentication;

		// If user is not signed in then redirect back home
		//if (!$scope.user) $location.path('/');

		$scope.createPage = function() {
			$scope.insects = [];
			$scope.insects = Insects.query({limit: 100, userId: Authentication.user._id});
		};

		$scope.create = function() {
			var ids = [];
			for (var i = 0; i < this.selectedInsects.length; i++) {
				ids.push(this.selectedInsects[i]._id);
			}

			var note = new Notes({
				title: this.title,
				content: this.content,
				insects: ids
			});
			note.$save(function(response) {
				$location.path('notes/' + response._id);

				$scope.title = '';
				$scope.content = '';
				$scope.selectedInsects = [];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(note) {
			if (note) {
				note.$remove();

				for (var i in $scope.notes) {
					if ($scope.notes[i] === note) {
						$scope.notes.splice(i, 1);
					}
				}
			} else {
				$scope.note.$remove(function() {
					$location.path('notes');
				});
			}
		};

		$scope.updatePage = function() {
			$scope.insects = [];
			$scope.insects = Insects.query({limit: 100, userId: Authentication.user._id});
		};

		$scope.update = function() {
			var ids = [];
			for (var i = 0; i < this.selectedInsects.length; i++) {
				ids.push(this.selectedInsects[i]._id);
			}

			var note = new Notes({
				_id: $scope.note._id,
				name: $scope.note.title,
				content: $scope.note.content,
				insects: ids
			});

			note.$update(function() {
				$location.path('notes/' + note._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.loading = true;

			$scope.notes = Notes.query(function() {
				$scope.loading = false;
			});
		};

		$scope.findOne = function() {
			$scope.loading = true;

			$scope.note = Notes.get({
				noteId: $stateParams.noteId
			}, function() {
				$scope.loading = false;
			}, function(err) {
				$scope.error = err.data.message;
				$scope.loading = false;
			});
		};
	}
]);
