/******************************************************************************\
|                                                                              |
|                            files-panel-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the workspace plots sidebar panel view.                  |
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
import SelectFilesDialogView from '../../../views/dialogs/select-files-dialog-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'files panel',

	template: _.template(`
		<div class="header">
			<label><i class="fa fa-file"></i>Files</label>
			<button class="change btn btn-sm" style="float:right">
				<i class="fa fa-pencil"></i>
			</button>
		</div>

		<form class="form-horizontal">
			<div class="background-file form-group">
				<label class="control-label">Background</label>
				<div class="controls" style="display:flex">
					<input type="text" class="form-control" value="<%= background %>" style="margin-right:10px; float:left" readonly />
				</div>
			</div>

			<div class="patchset-file form-group">
				<label class="control-label">Patchset</label>
				<div class="controls" style="display:flex">
					<input type="text" class="form-control" value="<%= patchset %>" style="margin-right:10px; float:left" readonly />
				</div>
			</div>
		</form>

		<div class="buttons" style="display:none">
			<button class="update btn" disabled>Update</button>
		</div>
	`),

	events: {
		'click .change.btn': 'onClickChange',
		'click .update.btn': 'onClickUpdate'
	},

	//
	// getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'background':
				return this.$el.find('.background-file input').val();
			case 'patchset':
				return this.$el.find('.patchset-file input').val();
		}
	},

	//
	// setting methods
	//

	setBackground: function(background) {
		this.$el.find('.background-file input').val(background);
		this.$el.find('.update.btn').prop('disabled', false);
	},

	setPatchset: function(patchset) {
		this.$el.find('.patchset-file input').val(patchset);
		this.$el.find('.update.btn').prop('disabled', false);
	},

	//
	// selection methods
	//

	selectFiles: function() {
		this.showSelectFilesDialog({
			model: this.model,

			// options
			//
			title: "Select Files",
			message: "Please select a background and (optionally) a corresponding patchset json file.",

			// callbacks
			//
			success: (background, patchset) => {
				this.setBackground(background);
				this.setPatchset(patchset);
				this.update();
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			background: this.model.get('background'),
			patchset: this.model.get('patchset')
		}
	},

	//
	// dialog rendering methods
	//

	showSelectFilesDialog: function(options) {

		// find workspace contents
		//
		this.model.fetchContents('*.json', {

			// callbacks
			//
			success: (files) => {
				application.show(new SelectFilesDialogView({
					model: this.model,
					collection: this.model.filesToCollection(files),

					// options
					//
					title: options.title,
					message: options.message,

					// callbacks
					//
					accept: (background, patchset) => {
						if (options.success) {
							options.success(background, patchset);
						}
					}
				}));
			},

			error: () => {
				alert("No workspace files found.");
			}
		});
	},

	update: function() {
		let background = this.getValue('background');
		let patchset = this.getValue('patchset');
		let queryString = '?background=' + background + (patchset? '&patchset=' + patchset : '');

		// go to plot view
		//
		application.navigate('#workspaces/' + this.model.get('id') + queryString, {
			trigger: true
		});
	},

	//
	// mouse event handling methods
	//

	onClickChange: function() {
		this.selectFiles();
	},

	onClickUpdate: function() {
		this.update();
	}
});