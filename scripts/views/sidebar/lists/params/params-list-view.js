/******************************************************************************\
|                                                                              |
|                             params-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of params.                      |
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
import ParamsListItemView from '../../../../views/sidebar/lists/params/params-list-item-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	className: 'params',
	childView: ParamsListItemView,

	//
	// sorting methods
	//

	viewComparator: function(view) {
		switch (this.options.sorting || 'name') {
			case 'name':
				return view.model.get('parameter');
			case 'impact':
				return -view.model.get('impact');
		}
	},

	//
	// getting methods
	//

	getValues: function() {
		let values = {};
		for (let i = 0; i < this.collection.length; i++) {
			let model = this.collection.at(i);
			let childView = this.children.findByModel(model);
			let key = childView.model.get('parameter');
			let value = childView.getValue();
			values[key] = value;
		}
		return values;
	},

	//
	// setting methods
	//

	setValues: function(values) {
		for (let i = 0; i < this.collection.length; i++) {
			let model = this.collection.at(i);
			let childView = this.children.findByModel(model);
			childView.setValue(values[i]);
		}
	},

	//
	// rendering options
	//

	childViewOptions: function() {
		return {
			onchange: this.options.onchange
		};
	}
});