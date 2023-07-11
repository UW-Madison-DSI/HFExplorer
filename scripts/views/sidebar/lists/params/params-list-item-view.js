/******************************************************************************\
|                                                                              |
|                           params-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single plot list item.               |
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
import RangeInputView from '../../../../views/forms/inputs/range-input-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'param',

	//
	// rendering methods
	//

	template: _.template(`
		<label><%= parameter.replace(/_/g, ' ') %></label>

		<button class="btn btn-sm lock<% if (locked) { %> locked<% } %>">
			<% if (locked) { %>
			<i class="fa fa-lock"></i>
			<% } else { %>
			<i class="fa fa-unlock"></i>
			<% } %>
		</button>

		<div class="impact">
		<% for (i = 0; i < impact; i++) { %>
		<i class="fa fa-square"></i>
		<% } %>
		</div>

		<div class="slider"></div>
	`),

	regions: {
		slider: {
			el: '.slider',
			replaceElement: true
		}
	},

	events: {
		'click .lock': 'onClickLock'
	},

	//
	// querying methods
	//

	isLocked: function() {
		return this.$el.find('.lock i').hasClass('fa-lock');
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.getChildView('slider').getValue();
	},

	getImpactLevel: function() {
		let impact = this.model.get('impact');

		if (impact == 0) {
			return 0;
		} else if (impact > 0.1) {
			return 3;
		} else if (impact > 0.01) {
			return 2;
		} else {
			return 1
		}
	},

	//
	// setting methods
	//

	setValue: function(value) {
		if (!this.isLocked()) {
			return this.getChildView('slider').setValue(value);
		}
	},

	setLocked: function(locked) {
		if (locked == undefined) {
			locked = true;
		}

		// update model
		//
		this.model.set('locked', locked);

		// update view
		//
		if (locked) {
			this.$el.addClass('locked');
			this.$el.find('.lock i').removeClass('fa-unlock').addClass('fa-lock');
		} else {
			this.$el.removeClass('locked');
			this.$el.find('.lock i').removeClass('fa-lock').addClass('fa-unlock');
		}
	},

	toggleLocked: function() {
		this.setLocked(!this.isLocked());
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			locked: this.model.get('locked'),
			impact: this.getImpactLevel()
		};
	},

	onRender: function() {
		this.showSlider();

		// update view
		//
		if (this.model.get('locked')) {
			this.$el.addClass('locked');
		}
	},

	showSlider: function() {
		let name = this.model.get('parameter');
		let min = this.model.get('suggested_bounds')[0];
		let max = this.model.get('suggested_bounds')[1];
		let minScale = min != 0? Math.log10(min) : 0;
		let maxScale = max != 0? Math.log10(max) : 0;
		let scale = Math.abs(maxScale - minScale > 3)? 'logarithmic' : 'linear';

		this.showChildView('slider', new RangeInputView({

			// options
			//
			name: name,
			min: min,
			max: max,
			value: this.model.get('suggested_init'),
			step: 0,
			size: 3,
			scale: scale,

			// callbacks
			//
			onchange: () => {
				this.options.onchange('param');
			}
		}));
	},

	//
	// mouse event handling methods
	//

	onClickLock: function() {

		// toggle locked status
		//
		this.toggleLocked();
	}
});