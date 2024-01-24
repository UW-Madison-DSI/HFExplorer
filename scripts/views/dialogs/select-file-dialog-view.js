/******************************************************************************\
|                                                                              |
|                          select-file-dialog-view.js                          |
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
			<div class="files"></div>
		</div>
		
		<div class="modal-footer">
			<button id="ok" class="btn btn-primary" data-dismiss="modal" disabled><i class="fa fa-check"></i>OK</button>
		</div>
	`),

	regions: {
		files: '.files'
	},

	events: {
		'click .modal-body': 'onClickModalBody',
		'click #ok': 'onClickOk',
		'keydown': 'onKeyDown'
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
		this.showChildView('files', new FileListView({
			collection: this.collection,

			// callbacks
			//
			onselect: (item) => {
				this.selected = item;

				// update button
				//
				this.update();
			}
		}));

		// set initial button state
		//
		this.update();
	},

	update: function() {
		if (this.options.optional) {
			this.setDisabled(false);
		} else {
			this.setDisabled(this.selected == null);
		}
	},

	//
	// mouse event handling methods
	//

	onClickModalBody: function() {
		this.selected = null;
		this.getChildView('files').deselectAll();
		this.update();
	},

	onClickOk: function() {

		// perform callback
		//
		if (this.options.accept) {
			this.options.accept(this.selected? this.selected.model : undefined);
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