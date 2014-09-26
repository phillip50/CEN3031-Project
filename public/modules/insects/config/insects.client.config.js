'use strict';

// Configuring the Insects module
angular.module('insects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Insects', 'insects', 'dropdown', '/insects(/create)?');
		Menus.addSubMenuItem('topbar', 'insects', 'List Insects', 'insects');
		Menus.addSubMenuItem('topbar', 'insects', 'New Article', 'insects/create');
	}
]);
