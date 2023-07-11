/******************************************************************************\
|                                                                              |
|                         patches-list-item-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single patches list item.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'tr',

	template: _.template(`
		<% for (let i = 0; i < values.length; i++) { %>
			<td><span><%= values[i] %></span></td>
		<% } %>
	`),

	events: {
		'click': 'onClick'
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		this.parent.setSelectedIndex(this.$el.index());

		// callbacks
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});