'use strict';

// Configuring the Notes module
angular.module('notes').run(['Menus',
	function(Menus) {
		// Set top bar menu items (Hidden for presentation)
		
		Menus.addMenuItem('topbar', 'Field Notes', 'notes', 'dropdown', '/notes(/create)?');
		Menus.addSubMenuItem('topbar', 'notes', 'List Notes', 'notes');
		Menus.addSubMenuItem('topbar', 'notes', 'New Note', 'notes/create');
		
	}
]);
