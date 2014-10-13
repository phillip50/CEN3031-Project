'use strict';

// Configuring the Insects module
angular.module('galleries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Galleries', 'galleries', 'dropdown', '/galleries(/newCreate)?');
		Menus.addSubMenuItem('topbar', 'galleries', 'List Galleries', 'galleries');
		Menus.addSubMenuItem('topbar', 'galleries', 'New Gallery', 'galleries/newCreate');
	}
]);
