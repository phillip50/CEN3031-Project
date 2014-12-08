'use strict';

// Configuring the Notes module
angular.module('notes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Field Notes', 'notes', 'dropdown', '/notes(/create)?', false, null, 2);
		Menus.addSubMenuItem('topbar', 'notes', 'List Field Notes', 'notes');
		Menus.addSubMenuItem('topbar', 'notes', 'New Field Note', 'notes/create');
	}
]);
