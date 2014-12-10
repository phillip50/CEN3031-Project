'use strict';

// Configuring the Insects module
angular.module('insects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position
		Menus.addMenuItem('topbar', 'Insects', 'insects', 'dropdown', '/insects(/create)?', true, null, -1);
		Menus.addSubMenuItem('topbar', 'insects', 'All Insects', 'insects', null, true, null, null, 'See everyone\'s insects.');
		Menus.addSubMenuItem('topbar', 'insects', 'View Map', 'insects/map',null, true, null, null, 'Look around to see where insects were caught.');
		// menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position
		Menus.addSubMenuItem('topbar', 'insects', 'New Insect', 'insects/create', null, false, null, null, 'Create your insect.');
	}
]);
