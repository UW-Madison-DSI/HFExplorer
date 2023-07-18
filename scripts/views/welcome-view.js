/******************************************************************************\
|                                                                              |
|                                  welcome-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the initial welcome view of the application.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Workspace from '../models/workspace.js';
import BaseViewView from '../views/base-view.js';

export default BaseViewView.extend({

	//
	// attributes
	//

	// prevent default form submission
	//
	attributes: {
		'onsubmit': 'return false'
	},

	events: {
		'click .background .select': 'onClickSelectBackground',
		'click .patchset .select': 'onClickSelectPatchset',
		'click .patchset .clear': 'onClickClearPatchset',
		'click .upload button': 'onClickUpload',
		'change .background input[type="file"]': 'onChangeBackgroundFile',
		'change .patchset input[type="file"]': 'onChangePatchsetFile'
	},

	//
	// form methods
	//

	submit: function() {
		let backgroundFile = $('.background input[type="file"]')[0];
		let patchsetFile = $('.patchset input[type="file"]')[0];

		// create new workspace
		//
		this.workspace = new Workspace();

		// upload workspace files
		//
		this.workspace.upload(backgroundFile, patchsetFile, {

			// callbacks
			//
			success: (workspace) => {

				// go to plot view
				//
				application.navigate('#workspaces/' + workspace.id, {
					trigger: true
				});
			},
			error: (response) => {
				alert(response.statusText)
			}
		});
	},

	toCSS: function(object) {
		if (!object) {
			return '';
		}
		let string = JSON.stringify(object);
		string = string.replace(/"/g, '');
		string = string.replace(/,/g, ';');
		string = string.replace('{', '');
		string = string.replace('}', '');
		return string;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			image_style: this.toCSS(defaults.welcome.splash.image.style)
		};
	},

	//
	// mouse event handling methods
	//

	onClickSelectBackground: function() {
		this.$el.find('.background input[type="file"]').trigger('click');
	},

	onChangeBackgroundFile: function() {
		this.$el.find('.background input[type="file"]').show();
		this.$el.find('.upload button').prop('disabled', false);
	},

	onClickSelectPatchset: function() {
		this.$el.find('.patchset input[type="file"]').trigger('click');
	},

	onChangePatchsetFile: function() {
		this.$el.find('.patchset input[type="file"]').show();
		this.$el.find('.patchset button.clear').prop('disabled', false);
	},

	onClickClearPatchset: function() {
		this.$el.find('.patchset input[type="file"]').val('');
	},

	onClickUpload: function() {
		this.submit();
	}
});