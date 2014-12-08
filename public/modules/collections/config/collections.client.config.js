'use strict';

// Configuring the Collections module
angular.module('collections').run(['Menus',
	function(Menus) {
		// Set top bar menu items (Hidden for presentation)
		
		Menus.addMenuItem('topbar', 'Collections', 'collections', 'dropdown', '/collections(/create)?');
		Menus.addSubMenuItem('topbar', 'collections', 'List Collections', 'collections',null, true, null, null, "See all of your collections");
		Menus.addSubMenuItem('topbar', 'collections', 'New Collection', 'collections/create',null, true, null, null,"Create a virtual insect collection");
		
	}
]);
