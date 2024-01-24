/******************************************************************************\
|                                                                              |
|                          select-files-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a dialog that is used to select a file from a list.           |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import DialogView from '../../views/dialogs/dialog-view.js';
import FileListView from '../../views/collections/file-lists/file-list-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	className: 'focused modal notify-dialog',

	template: _.template(`
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
				<i class="fa fa-close"></i>
			</button>
			<h1 id="modal-header-text">
				<% if (icon) { %>
				<i class="<%= icon %>"></i>
				<% } else { %>
				<i class="fa fa-file"></i>
				<% } %>
				<% if (title) { %>
				<%= title %>
				<% } else { %>
				Select File
				<% } %>
			</h1>
		</div>
		
		<div class="modal-body">
			<p><%= message %></p>
			<div class="columns">
				<div class="column half-width">
					<label>Background:</label>
					<div class="background"></div>
				</div>
				<div class="column half-width">
					<label>Patchset (optional):</label>
					<div class="patchset"></div>
				</div>
			</div>
		</div>
		
		<div class="modal-footer">
			<button id="ok" class="btn btn-primary" data-dismiss="modal" disabled><i class="fa fa-check"></i>OK</button>
		</div>
	`),

	regions: {
		background: '.background',
		patchset: '.patchset'
	},

	events: {
		'click .modal-body': 'onClickModalBody',
		'click #ok': 'onClickOk',
		'keydown': 'onKeyDown'
	},

	//
	// getting methods
	//

	getFile: function() {

	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('#ok').prop('disabled', disabled);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.options.title,
			icon: this.options.icon,
			message: this.options.message
		};
	},

	onRender: function() {

		// show child views
		//
		this.showBackgroundFiles();
		this.showPatchsetFiles();

		// set initial button state
		//
		this.update();
	},

	showBackgroundFiles: function() {
		this.showChildView('background', new FileListView({
			collection: this.collection,
			selected: this.collection.getModelByAttribute('name', this.model.get('background')),

			// callbacks
			//
			onselect: (item) => {
				this.background = item? item.model.get('name') : undefined;

				// update button
				//
				this.update();
			}
		}));
	},

	showPatchsetFiles: function() {
		this.showChildView('patchset', new FileListView({
			collection: this.collection,
			selected: this.collection.getModelByAttribute('name', this.model.get('patchset')),

			// callbacks
			//
			onselect: (item) => {
				this.patchset = item? item.model.get('name') : undefined;

				// update button
				//
				this.update();
			}
		}));
	},

	update: function() {
		this.setDisabled(this.background == null);
	},

	//
	// mouse event handling methods
	//

	onClickModalBody: function() {

		// update attributes
		//
		this.background = null;
		this.patchset = null;

		// update view
		//
		this.getChildView('background').deselectAll();
		this.getChildView('patchset').deselectAll();
		this.setDisabled(true);
		this.update();
	},

	onClickOk: function() {

		// perform callback
		//
		if (this.options.accept) {
			this.options.accept(this.background, this.patchset);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// respond to enter key press
		//
		if (event.keyCode === 13) {

			// close modal dialog
			//
			this.dialog.hide();

			// perform callback
			//
			this.onClickOk();
		}
	}
});