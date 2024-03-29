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

import BaseView from '../views/base-view.js';
import UploadLocalFormView from '../views/forms/upload-local-form-view.js';
import UploadRemoteFormView from '../views/forms/upload-remote-form-view.js';
import '../../vendor/bootstrap/js/tab.js';

export default BaseView.extend({

	//
	// attributes
	//

	regions: {
		local: '.local-panel',
		remote: '.remote-panel'
	},

	//
	// rendering methods
	//

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

	templateContext: function() {
		return {
			image_style: this.toCSS(defaults.welcome.splash.image.style)
		};
	},

	onRender: function() {

		// show child views
		//
		this.showChildView('local', new UploadLocalFormView());
		this.showChildView('remote', new UploadRemoteFormView());
	}
});