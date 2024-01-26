/******************************************************************************\
|                                                                              |
|                                 files-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines view of file items (lists, icons etc.)                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import FileListView from '../../views/collections/file-lists/file-list-view.js';
import FileIconsView from '../../views/collections/file-icons/file-icons-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'files',
	template: _.template('<div class="items"></div>'),

	regions: {
		items: {
			el: '.items',
			replaceElement: true
		}
	},

	//
	// selection methods
	//

	selectAll: function() {
		this.getChildView('items').selectAll();
	},

	deselectAll: function() {
		this.getChildView('items').deselectAll();
	},

	//
	// rendering methods
	//

	onRender: function() {
		switch (this.options.view_kind) {
			case 'lists':
				this.showList();
				break;
			case 'icons':
				this.showIcons();
				break;
		}
	},

	showList: function() {
		this.showChildView('items', new FileListView({
			collection: this.collection,

			// options
			//
			selected: this.options.selected,

			// callbacks
			//
			onselect: this.options.onselect
		}))
	},

	showIcons: function() {
		this.showChildView('items', new FileIconsView({
			collection: this.collection,

			// options
			//
			selected: this.options.selected,

			// callbacks
			//
			onselect: this.options.onselect
		}))
	}
});