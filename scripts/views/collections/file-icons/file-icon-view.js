/******************************************************************************\
|                                                                              |
|                             file-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view that shows a single list item.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'li',

	template: _.template(`
		<div class="icon"><i class="fa <%= icon %>"></i></div>
		<div class="name"><%= name %></div>
	`),

	events: {
		'click': 'onClick'
	},

	//
	// querying methods
	//

	isSelected: function() {
		return this.$el.hasClass('selected');
	},

	//
	// selection methods
	//

	select: function() {
		this.$el.addClass('selected');
	},

	deselect: function() {
		this.$el.removeClass('selected');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: 'fa-file',
			name: this.model.get('name').replace(/\//g, '/<wbr>')
		}
	},

	onRender: function() {
		if (this.options.selected) {
			this.select();
		}
	},

	onClick: function(event) {
		this.parent.deselectAll();
		this.select();

		// block from parent
		//
		event.stopPropagation();

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(this);
		}
	}
});