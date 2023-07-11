/******************************************************************************\
|                                                                              |
|                              workspace-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level view of our application.                   |
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
import ToolbarView from '../views/toolbar-view.js';
import WorkspaceSplitView from '../views/workspace-split-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	id: 'workspace',

	template: _.template(`
		<div id="toolbar"></div>
		<div id="contents"></div>
	`),

	regions: {
		toolbar: {
			el: '#toolbar',
			replaceElement: true
		},
		contents: {
			el: '#contents',
			replaceElement: true
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showToolbar();
		this.showContents();
	},

	showToolbar: function() {
		this.showChildView('toolbar', new ToolbarView());
	},

	showContents: function() {
		this.showChildView('contents', new WorkspaceSplitView({
			model: this.model
		}));
	},

	//
	// window event handling methods
	//

	onResize: function() {
		if (this.hasChildView('contents')) {
			this.getChildView('contents').onResize();
		}
	}
});