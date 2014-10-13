'use strict';

// Configuring the Gallerys module
angular.module('gallerys').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Gallerys', 'gallerys', 'dropdown', '/gallerys(/create)?');
		Menus.addSubMenuItem('topbar', 'gallerys', 'List Gallerys', 'gallerys');
		Menus.addSubMenuItem('topbar', 'gallerys', 'New Gallery', 'gallerys/create');
	}
]);