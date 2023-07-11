/******************************************************************************\
|                                                                              |
|                            params-panel-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a panel view used for viewing parameters.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';
import BaseCollection from '../../../collections/base-collection.js';
import BaseView from '../../../views/base-view.js';
import ParamsListView from '../../../views/sidebar/lists/params/params-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'params panel',

	template: _.template(`
		<div class="header">
			<label>
				<i class="fa fa-sliders"></i>Parameters
			</label>

			<div class="radio-buttons">
				<div class="radio-inline">
					<label>Sort</label>
				</div>
				<div class="radio-inline">
					<label><input type="radio" name="sort" value="impact" checked>Impact</label>
				</div>
				<div class="radio-inline">
					<label><input type="radio" name="sort" value="name">Name</label>
				</div>
			</div>
		</div>

		<div class="params-list"></div>
	`),

	regions: {
		params_list: {
			el: '.params-list',
			replaceElement: true
		}
	},

	events: {
		'click .sorting input': 'onClickSorting'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = this.paramsToCollection(this.options.params);
	},

	//
	// conversion methods
	//

	paramsToCollection: function(params) {
		let collection = new BaseCollection();
		for (let i = 0; i < params.parameters.length; i++) {
			collection.add(new BaseModel({
				parameter: params.parameters[i],
				suggested_init: params.suggested_init[i],
				suggested_bounds: params.suggested_bounds[i],
				impact: params.impacts[i],
				locked: false
			}))
		}
		return collection;
	},

	//
	// getting methods
	//

	getValues: function() {
		return this.getChildView('params_list').getValues();
	},

	getSorting: function() {
		return this.$el.find('.sorting input:checked').val();
	},

	//
	// setting methods
	//

	setValues: function(values) {
		this.getChildView('params_list').setValues(values);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showSliders();
	},

	showSliders: function() {
		this.showChildView('params_list', new ParamsListView({
			collection: this.collection,
			sorting: this.getSorting(),

			// callbacks
			//
			onchange: this.options.onchange
		}));
	},

	//
	// event handling methods
	//

	onClickSorting: function() {
		this.showSliders();
	}
});