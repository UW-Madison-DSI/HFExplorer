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
import BaseView from '../views/base-view.js';
import '../../vendor/bootstrap/js/tab.js';

export default BaseView.extend({

	//
	// attributes
	//

	// prevent default form submission
	//
	attributes: {
		'onsubmit': 'return false'
	},

	events: {

		// mouse events
		//
		'click .background.btn': 'onClickSelectBackground',
		'click .patchset.btn': 'onClickSelectPatchset',
		'click .clear.btn': 'onClickClear',
		'click .upload-files button': 'onClickUploadFiles',
		'click .upload-url button': 'onClickUploadUrl',

		// file events
		//
		'change #background-file': 'onChangeBackgroundFile',
		'change #patchset-file': 'onChangePatchsetFile'
	},

	//
	// getting methods
	//

	getBackgroundFile: function() {
		return this.$el.find('#background-file')[0];
	},

	getPatchsetFile: function() {
		return this.$el.find('#patchset-file')[0];
	},

	getUrl: function() {
		return this.$el.find('.url input[type="text"]').val();
	},

	getFileType: function() {
		return this.$el.find('.file-type input:checked').val();
	},

	//
	// form methods
	//

	uploadFiles: function() {

		// create new workspace
		//
		this.workspace = new Workspace();

		// upload workspace files
		//
		this.workspace.uploadFiles(this.getBackgroundFile(), this.getPatchsetFile(), {

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

	uploadUrl: function() {

		// create new workspace
		//
		this.workspace = new Workspace();

		// upload workspace files
		//
		this.workspace.uploadUrl(this.getUrl(), {

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
		this.$el.find('#background-file').trigger('click');
	},

	onClickSelectPatchset: function() {
		this.$el.find('#patchset-file').trigger('click');
	},

	onClickClear: function() {
		this.$el.find('#patchset-file').val('');
		this.$el.find('#patchset-file').hide();
	},

	onClickUploadFiles: function() {
		this.uploadFiles();
	},

	onClickUploadUrl: function() {
		this.uploadUrl();
	},

	//
	// file event handling methods
	//

	onChangeBackgroundFile: function() {
		this.$el.find('#background-file').show();
		this.$el.find('.upload-files button').prop('disabled', false);
	},

	onChangePatchsetFile: function() {
		this.$el.find('#patchset-file').show();
		this.$el.find('.btn.clear').prop('disabled', false);
	}
});