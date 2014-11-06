'use strict';

// Configuring the Insects module
angular.module('insects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Insects', 'insects', 'dropdown', '/insects(/create)?', false);
		Menus.addSubMenuItem('topbar', 'insects', 'All Insects', 'insects');
		Menus.addSubMenuItem('topbar', 'insects', 'View Map', 'insects/map');
		Menus.addSubMenuItem('topbar', 'insects', 'New Insect', 'insects/create');
	}
]);
