/******************************************************************************\
|                                                                              |
|                         upload-remote-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for uploading remote files.                       |
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
import SelectFileDialogView from '../../views/dialogs/select-file-dialog-view.js';
import Loadable from '../../views/behaviors/effects/loadable.js';

export default FormView.extend(_.extend({}, Loadable, {

	//
	// attributes
	//

	template: _.template(`
		<div class="upload-workspace form-group">
			<label class="control-label">&nbsp;</label>
			<div class="controls">
				<label>Step 1: Upload Workspace</label>
				<div>First, enter the URL to a JSON workspace.  Most often, these will be URLs from <a href="http://hepdata.net">www.hepdata.net</a>. This must be a URL to a pyhf workspace. </div>
				<input type="text" class="form-control" value="<%= defaults.welcome.workspace_url %>" />
				<button class="btn" style="margin-top:10px">Upload</button>
			</div>
		</div>

		<div class="select-background form-group">
			<label class="control-label">&nbsp;</label>
			<div class="controls">
				<label>Step 2: Select Background</label>
				<div>Select a background .json file. </div>
				<button class="btn btn-light" style="float:left; margin-right:10px" disabled>Select Background</button>
				<input type="text" class="form-control" style="display:none; width:50%" readonly />
			</div>
		</div>

		<div class="select-patchset form-group">
			<label class="control-label">&nbsp;</label>
			<div class="controls">
				<label>Step 3: Select Patchset (optional)</label>
				<div>Optionally select a patchset .json file to merge. </div>
				<button class="select btn btn-light" style="float:left; margin-right:10px" disabled>Select Patchset</button>
				<input type="text" class="form-control" style="float:left; margin-right:10px; width:50%; display:none" readonly />
				<button class="clear btn btn-light" style="display:none">Clear</button>
			</div>
		</div>

		<div class="view-workspace form-group">
			<label class="control-label">&nbsp;</label>
			<div class="controls">
				<label>Step 4: View Workspace</label>
				<div>View your workspace files. </div>
				<button class="btn btn-primary" disabled>View</button>
			</div>
		</div>
	`),

	events: {

		// mouse events
		//
		'click .upload-workspace button': 'onClickUploadWorkspace',
		'click .select-background button': 'onClickSelectBackground',
		'click .select-patchset .select': 'onClickSelectPatchset',
		'click .select-patchset .clear': 'onClickClearPatchset',
		'click .view-workspace button': 'onClickViewWorkspace'
	},

	//
	// getting methods
	//

	getUrl: function() {
		return this.$el.find('.upload-workspace input').val();
	},

	//
	// setting methods
	//

	setBackground: function(background) {
		this.background = background;

		// show background file
		//
		this.$el.find('.select-background input').val(background).show();

		// enable view button
		//
		this.$el.find('.view-workspace button').prop('disabled', false);
	},

	setPatchset: function(patchset) {
		this.patchset = patchset;

		// show patchset file
		//
		this.$el.find('.select-patchset input').val(patchset).show();
		this.$el.find('.select-patchset .clear').show();
	},

	clearPatchset: function() {
		this.patchset = null;

		// hide patchset file
		//
		this.$el.find('.select-patchset input').val('').hide();
		this.$el.find('.select-patchset .clear').hide();
	},

	//
	// selection methods
	//

	selectBackground: function() {
		this.showSelectFileDialog(this.collection, {

			// options
			//
			title: "Select Background File",
			message: "Please select a background json file.",
			optional: false,

			// callbacks
			//
			success: (model) => {
				this.setBackground(model.get('name'));
			}
		});
	},

	selectPatchset: function() {
		this.showSelectFileDialog(this.collection, {

			// options
			//
			title: "Select Patchset File",
			message: "Please select a patchset json file.",
			optional: true,

			// callbacks
			//
			success: (model) => {
				if (model) {
					this.setPatchset(model.get('name'));
				}
			}
		});
	},

	selectFiles: function(collection, options) {

		// select background file
		//
		this.showSelectFileDialog(collection, {

			// options
			//
			title: "Select Background File",
			message: "Please select a background json file.",
			optional: false,

			// callbacks
			//
			success: (model) => {
				let background = model;

				// select patchset file
				//
				this.showSelectFileDialog(collection, {

					// options
					//
					title: "Select Patchset File (Optional)",
					message: "Please select a patchset json file.",
					optional: true,

					// callbacks
					//
					success: (model) => {
						let patchset = model;

						// perform callback
						//
						options.success({
							background: background,
							patchset: patchset
						});
					}
				});
			}
		});
	},

	uploadWorkspace: function() {

		// create new workspace
		//
		this.workspace = new Workspace();

		// start upload
		//
		this.showSpinner();

		// upload workspace files
		//
		this.workspace.uploadUrl(this.getUrl(), {

			// callbacks
			//
			success: (workspace) => {
				this.hideSpinner();

				// update workspace
				//
				this.workspace.set('id', workspace.id);

				// find workspace contents
				//
				this.workspace.fetchContents('*.json', {

					// callbacks
					//
					success: (files) => {
						this.collection = this.workspace.filesToCollection(files);

						// enable select buttons
						//
						this.$el.find('.select-background button').prop('disabled', false);
						this.$el.find('.select-patchset button').prop('disabled', false);
					},

					error: () => {
						alert("No workspace files found.");
					}
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

	viewWorkspace: function(workspace, background, patchset) {

		// convert params to query string
		//
		let searchParams = new URLSearchParams({
			background: background,
			patchset: patchset
		});
		let queryString = searchParams.toString();

		// go to plot view
		//
		application.navigate('#workspaces/' + workspace.id + '?' + queryString, {
			trigger: true
		});
	},

	//
	// dialog rendering methods
	//

	showSelectFileDialog: function(collection, options) {
		application.show(new SelectFileDialogView({
			collection: collection,

			// options
			//
			title: options.title,
			message: options.message,
			optional: options.optional,

			// callbacks
			//
			accept: (file) => {
				if (options.success) {
					options.success(file);
				}
			}
		}));
	},

	//
	// mouse event handling methods
	//

	onClickUploadWorkspace: function() {
		this.uploadWorkspace();
	},

	onClickSelectBackground: function() {
		this.selectBackground();
	},

	onClickSelectPatchset: function() {
		this.selectPatchset();
	},

	onClickClearPatchset: function() {
		this.clearPatchset();
	},

	onClickViewWorkspace: function() {
		this.viewWorkspace(this.workspace, this.background, this.patchset);
	},
}));