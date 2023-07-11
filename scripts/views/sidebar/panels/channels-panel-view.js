/******************************************************************************\
|                                                                              |
|                          channels-panel-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a panel view used for viewing channels.                  |
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
import ChannelsListView from '../../../views/sidebar/lists/channels/channels-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'channels panel',

	template: _.template(`
		<div class="header">
			<label><i class="fa fa-tv"></i>Channels</label>

			<div class="selection radio-buttons">
				<div class="radio-inline">
					<label>Select</label>
				</div>
				<div class="radio-inline">
					<label><input type="radio" name="selection" value="one" checked>One</label>
				</div>
				<div class="radio-inline">
					<label><input type="radio" name="selection" value="all">All</label>
				</div>
			</div>
		</div>

		<div class="channels list"></div>
	`),

	regions: {
		channels: {
			el: '.channels.list',
			replaceElement: false
		}
	},

	events: {
		'click input[name="selection"]': 'onClickSelection'
	},

	//
	// getting methods
	//

	getValues: function() {
		return this.getChildView('channels').getValues();
	},

	getSelected: function() {
		return this.getChildView('channels').getSelected();
	},

	getSelection: function() {
		return this.$el.find('.selection input:checked').val();
	},

	//
	// converting methods
	//

	valuesToCollection: function(names) {
		let collection = new BaseCollection();
		for (let i = 0; i < names.length; i++) {
			collection.add(new BaseModel({
				name: names[i]
			}))
		}
		return collection;
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showChannels(this.options.channels);
	},

	showChannels: function(channels) {
		this.collection = this.valuesToCollection(channels);

		// show list of channels
		//
		this.showChildView('channels', new ChannelsListView({
			collection: this.collection,
			selected: this.options.selected,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSelection: function() {
		switch (this.getSelection()) {
			case 'one':
				this.getChildView('channels').setSelectable(true);
				this.getChildView('channels').setSelected([this.collection.at(0).get('name')]);
				break;
			case 'all':
				this.getChildView('channels').selectAll();
				this.getChildView('channels').setSelectable(false);
				break;
		}
	}
});