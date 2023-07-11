/******************************************************************************\
|                                                                              |
|                           actions-panel-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the workspace actions sidebar panel view.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'actions panel',

	template: _.template(`
		<div class="header">
			<label><i class="fa fa-play"></i>Actions</label>
		</div>

		<div class="buttons">
			<button class="fit btn btn-primary"><i class="fa fa-compress"></i><span>Perform Fit</span></button>
			<button class="new btn"><i class="fa fa-magic"></i><span>New Workspace</span></button>
			<button class="reset btn"><i class="fa fa-repeat"></i><span>Reset Params</span></button>
			<button class="download btn"><i class="fa fa-download"></i><span>Download Plot</span></button>
		</div>
	`),

	events: {
		'click .fit': 'onClickFit',
		'click .new': 'onClickNew',
		'click .reset': 'onClickReset',
		'click .download': 'onClickDownload',
		'keydown': 'onKeyDown'
	},

	//
	// rendering methods
	//

	onAttach: function() {
		this.$el.find('.btn-primary').focus();
	},

	//
	// event handling methods
	//

	onClickFit: function() {
		this.parent.parent.fit();
	},

	onClickNew: function() {

		// go to home view
		//
		application.navigate('/', {
			trigger: true
		});
	},

	onClickReset: function() {
		this.parent.parent.reset();
	},

	onClickDownload: function() {
		this.parent.parent.download();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (event.keyCode == 13) {
			this.onClickHome();
		}
	}
});