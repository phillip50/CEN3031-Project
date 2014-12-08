'use strict';

// Configuring the Groups module
angular.module('groups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Groups', 'groups', 'dropdown', '/groups(/create)?', false, null, 9, "test");
		Menus.addSubMenuItem('topbar', 'groups', 'List Groups', 'groups', null, true, null, null, "View all classes you are in");
		Menus.addSubMenuItem('topbar', 'groups', 'New Group', 'groups/create', null, true, null, null, "Create a class for easy assignment submition");
	}
]);
