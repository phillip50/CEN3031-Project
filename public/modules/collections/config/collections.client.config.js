'use strict';

// Configuring the Collections module
angular.module('collections').run(['Menus',
	function(Menus) {
		// Set top bar menu items (Hidden for presentation)
		
		Menus.addMenuItem('topbar', 'Collections', 'collections', 'dropdown', '/collections(/create)?');
		Menus.addSubMenuItem('topbar', 'collections', 'List Collections', 'collections');
		Menus.addSubMenuItem('topbar', 'collections', 'New Collection', 'collections/create');
		
	}
]);
