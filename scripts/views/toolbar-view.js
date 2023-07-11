/******************************************************************************\
|                                                                              |
|                                toolbar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a workspace top / header toolbar view.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	id: 'toolbar',

	template: _.template(`
		<button class="fit btn btn-primary"><i class="fa fa-compress"></i><span class="hidden-xs">Perform </span><span>Fit</span></button>
		<button class="new btn"><i class="fa fa-magic"></i><span>New</span><span class="hidden-xs"> Workspace</span></button>
		<button class="reset btn"><i class="fa fa-repeat"></i><span>Reset</span><span class="hidden-xs"> Params</span></button>
		<button class="download btn"><i class="fa fa-download"></i><span>Download</span><span class="hidden-xs"> Plot</span></button>
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
		this.parent.getChildView('contents').fit();
	},

	onClickNew: function() {

		// go to home view
		//
		application.navigate('/', {
			trigger: true
		});
	},

	onClickReset: function() {
		this.parent.getChildView('contents').reset();
	},

	onClickDownload: function() {
		this.parent.getChildView('contents').download();
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