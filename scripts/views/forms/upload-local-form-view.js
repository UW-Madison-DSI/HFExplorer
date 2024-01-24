/******************************************************************************\
|                                                                              |
|                          upload-local-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for uploading local files.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Workspace from '../../models/workspace.js';
import FormView from '../../views/forms/form-view.js';
import Loadable from '../../views/behaviors/effects/loadable.js';

export default FormView.extend(_.extend({}, Loadable, {

	//
	// attributes
	//

	template: _.template(`
		<div class="select-background form-group">
			<label class="control-label">&nbsp;</label>
			<div class="controls">
				<label>Step 1: Select Background</label>
				<div>First, select a background .json file. </div>
				<button class="btn btn-light" style="float:left; margin-right:10px">Select Background</button>
				<input type="file" id="background-file" class="form-control" style="display:none; width:50%" />
			</div>
		</div>

		<div class="select-patchset form-group">
			<label class="control-label">&nbsp;</label>
			<div class="controls">
				<label>Step 2: Select Patchset (optional)</label>
				<div>Next, optionally select a patchset .json file to merge. </div>
				<button class="select btn btn-light" style="float:left; margin-right:10px">Select Patchset</button>
				<input type="file" id="patchset-file" class="form-control" style="float:left; margin-right:10px; display:none; width:50%" />
				<button class="clear btn btn-light" style="display:none">Clear</button>
			</div>
		</div>

		<div class="upload-files form-group">
			<label class="control-label">&nbsp;</label>
			<div class="controls">
				<label>Step 3: Upload</label>
				<div>Upload and view your workspace files. </div>
				<button class="submit btn btn-primary" disabled>Upload</button>
			</div>
		</div>
	`),

	// prevent default form submission
	//
	attributes: {
		'onsubmit': 'return false'
	},

	events: {

		// mouse events
		//
		'click .select-background button': 'onClickSelectBackground',
		'click .select-patchset .select': 'onClickSelectPatchset',
		'click .select-patchset .clear': 'onClickClearPatchset',
		'click .upload-files button': 'onClickUploadFiles',

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

	//
	// form methods
	//

	uploadFiles: function() {

		// create new workspace
		//
		this.workspace = new Workspace();

		// start upload
		//
		this.showSpinner();

		// upload workspace files
		//
		this.workspace.uploadFiles(this.getBackgroundFile(), this.getPatchsetFile(), {

			// callbacks
			//
			success: (workspace) => {
				this.hideSpinner();

				// go to plot view
				//
				application.navigate('#workspaces/' + workspace.id, {
					trigger: true
				});
			},
			error: (response) => {
				this.hideSpinner();

				// show error message
				//
				alert(response.statusText)
			}
		});
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

	onClickClearPatchset: function() {
		this.$el.find('#patchset-file').val('');
		this.$el.find('#patchset-file').hide();
		this.$el.find('.select-patchset .clear').hide();
	},

	onClickUploadFiles: function() {
		this.uploadFiles();
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
		this.$el.find('.select-patchset .clear').show();
	}
}));