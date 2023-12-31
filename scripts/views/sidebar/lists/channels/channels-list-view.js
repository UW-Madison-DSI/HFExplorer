/******************************************************************************\
|                                                                              |
|                           channels-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of channels.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import CollectionView from '../../../../views/collections/collection-view.js';
import ChannelsListItemView from '../../../../views/sidebar/lists/channels/channels-list-item-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'table',

	template: _.template(`
		<tbody>
		</tbody>
	`),

	childView: ChannelsListItemView,
	selectable: true,

	//
	// querying methods
	//

	indexOf: function(channel) {
		for (let i = 0; i < this.collection.length; i++) {
			let model = this.collection.at(i);
			if (model.get('name') == channel) {
				return i;
			}
		}
	},

	//
	// getting methods
	//

	getValues: function() {
		let names = [];
		for (let i = 0; i < this.collection.length; i++) {
			let model = this.collection.at(i);
			names.push(model.get('name'));
		}
		return names;
	},

	getModel: function(channel) {
		return this.collection.where({
			name: channel
		})[0];
	},

	getSelected: function() {
		let names = [];
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (childView.isSelected()) {
				names.push(childView.model.get('name'));
			}
		}
		return names;
	},

	//
	// setting methods
	//

	setSelected: function(channels) {
		if (!this.selectable) {
			return;
		}

		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			childView.setSelected(channels.includes(childView.model.get('name')));
		}

		// callbacks
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	setSelectable: function(selectable) {
		this.selectable = selectable;
	},

	//
	// selecting methods
	//

	selectAll: function() {
		for (let i = 0; i < this.children.length; i++) {
			this.children.findByIndex(i).select();
		}
	},

	deselectAll: function() {
		for (let i = 0; i < this.children.length; i++) {
			this.children.findByIndex(i).deselect();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			labels: this.options.labels
		};
	},

	onRender: function() {
		if (this.collection.length > 0) {
			this.setSelected([this.collection.at(0).get('name')]);
		}
	},

	childViewOptions: function() {
		return {
			onchange: this.options.onchange
		};
	}
});