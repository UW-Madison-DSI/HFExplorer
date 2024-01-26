/******************************************************************************\
|                                                                              |
|                               file-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view for displaying a generic list.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CollectionView from '../../../views/collections/collection-view.js';
import FileIconView from '../../../views/collections/file-icons/file-icon-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'icon-grid',
	childView: FileIconView,

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			selected: model == this.options.selected,
			onselect: this.options.onselect
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDownTableHead: function() {
		if (this.selectable) {
			this.deselectAll();
		}
	}
});