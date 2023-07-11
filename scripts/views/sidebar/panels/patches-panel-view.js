/******************************************************************************\
|                                                                              |
|                           patches-panel-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a panel view used for viewing patchsets.                 |
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
import PatchesListView from '../../../views/sidebar/lists/patches/patches-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'patches panel',

	template: _.template(`
		<div class="header">
			<label><i class="fa fa-square-plus"></i>Patches</label>
		</div>

		<div class="description"><%= description %></div>
		<div class="patches list"></div>
	`),

	regions: {
		patches: {
			el: '.patches.list',
			replaceElement: false
		}
	},

	//
	// constructor
	//

	initialize: function() {
		this.collection = this.valuesToCollection(this.options.patches.values);
	},

	//
	// getting methods
	//

	getValues: function() {
		return this.getChildView('patches').getValues();
	},

	//
	// converting methods
	//

	valuesToCollection: function(values) {
		let collection = new BaseCollection();
		for (let i = 0; i < values.length; i++) {
			collection.add(new BaseModel({
				// values: values[i].slice(1)
				values: values[i]
			}))
		}
		return collection;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			description: this.options.patches.metadata.description,
			patches: this.options.patches
		}
	},

	onRender: function() {
		this.showPatches();
	},

	showPatches: function() {
		this.showChildView('patches', new PatchesListView({
			collection: this.collection,

			// options
			//
			labels: this.options.patches.metadata.labels,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	}
});