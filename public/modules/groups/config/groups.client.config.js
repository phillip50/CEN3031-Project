'use strict';

// Configuring the Groups module
angular.module('groups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Groups & Classes', 'groups', 'dropdown', '(/groups(/classes)?||/groups(/create)?)', false, null, 9, 'test');
		Menus.addSubMenuItem('topbar', 'groups', 'List Groups', 'groups', null, true, null, null, 'View all groups.');
		Menus.addSubMenuItem('topbar', 'groups', 'List Classes', 'groups/classes', null, true, null, null, 'View all classes.');
		Menus.addSubMenuItem('topbar', 'groups', 'New Group', 'groups/create', null, true, null, null, 'Create a group for collabration.');
	}
]);
