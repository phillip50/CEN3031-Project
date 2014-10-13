'use strict';

angular.module('insects').directive('validFile', [
	function() {
		return {
			require: 'ngModel',
			link: function postLink(scope, element, attrs, ngModel) {
				element.bind('change', function() {
					scope.$apply(function() {
						ngModel.$setViewValue(element.val());
						ngModel.$render();
					});
				});
			}
		};
	}
]);
