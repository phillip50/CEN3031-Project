'use strict';

// Configuring the Collections module
angular.module('collections').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Collections', 'collections', 'dropdown', '/collections(/create)?');
		Menus.addSubMenuItem('topbar', 'collections', 'List Collections', 'collections',null, true, null, null, 'See everyone\'s collections');
		Menus.addSubMenuItem('topbar', 'collections', 'New Collection', 'collections/create',null, false, null, null, 'Create a virtual insect collection.');
	}
]);
