/******************************************************************************\
|                                                                              |
|                         channels-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single channels list item.           |
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
		<td>
			<%= name %>
			<input type="checkbox" />
		</td>
	`),

	events: {
		'click input[type="checkbox"]': 'onClickCheckbox'
	},

	//
	// conversion methods
	//

	toChannelName: function(name) {
		name =  name.replace(/_/g, ' ');
		name = name.replace('prefit', '(prefit)');
		name = name.replace('postfit', '(postfit)');
		name = name.replace('custom parameters', '(custom parameters)');
		return name;
	},

	//
	// querying methods
	//

	isSelected: function() {
		return this.$el.find('input').is(':checked');
	},

	//
	// setting methods
	//

	setSelected: function(selected) {
		if (selected) {
			this.select();
		} else {
			this.deselect();
		}
	},

	//
	// selecting methods
	//

	select: function() {
		this.$el.find('input').prop('checked', true);
	},

	deselect: function() {
		this.$el.find('input').prop('checked', false);
	},

	toggle: function() {
		if (!this.isSelected()) {
			this.select();
		} else {
			this.deselect();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.toChannelName(this.model.get('name'))
		}
	},

	//
	// mouse event handling methods
	//

	onClickCheckbox: function() {
		// this.toggle();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});