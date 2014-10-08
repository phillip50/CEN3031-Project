'use strict';

// Configuring the Insects module
angular.module('galleries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Galleries', 'galleries', 'dropdown', '/galleries(/create)?');
		Menus.addSubMenuItem('topbar', 'galleries', 'List Galleries', 'galleries');
		Menus.addSubMenuItem('topbar', 'galleries', 'New Gallery', 'galleries/create');
	}
]);
