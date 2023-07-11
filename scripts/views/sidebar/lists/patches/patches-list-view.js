/******************************************************************************\
|                                                                              |
|                             patches-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of patches.                     |
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
import PatchesListItemView from '../../../../views/sidebar/lists/patches/patches-list-item-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'table',

	template: _.template(`
		<thead>
			<tr>
			<% for (let i = 0; i < columns; i++) { %>
				<th><span></span></th>
			<% } %>
			<% for (let i = 0; i < labels.length; i++) { %>
				<th><span><%= labels[i].toTitleCase() %></span></th>
			<% } %>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),

	childView: PatchesListItemView,

	//
	// getting methods
	//

	getSelectedIndex: function() {
		let row = this.$el.find('tbody tr.selected');
		return $(row[0]).index();
	},

	getSelected: function() {
		return this.collection.at(this.getSelectedIndex());
	},

	getValues: function() {
		return this.getSelected().get('values');
	},

	//
	// setting methods
	//

	setSelectedIndex: function(index) {
		let rows = this.$el.find('tbody tr');
		this.$el.find('tbody tr.selected').removeClass('selected');
		$(rows[index]).addClass('selected');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let model = this.collection.at(0);
		let values = model.get('values');
		let columns = values.length - this.options.labels.length;

		return {
			columns: columns,
			labels: this.options.labels
		};
	},

	onRender: function() {
		this.setSelectedIndex(this.options.selected || 0);
	},

	childViewOptions: function() {
		return {
			onchange: this.options.onchange
		};
	}
});