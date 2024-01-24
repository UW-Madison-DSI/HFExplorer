/******************************************************************************\
|                                                                              |
|                                workspace.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of pyhf workspace.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseModel from '../models/base-model.js';
import BaseCollection from '../collections/base-collection.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		id: undefined,
		background: undefined,
		patchset: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.server + '/workspaces',

	//
	// getting methods
	//

	getHistogramUrl: function(name) {
		return config.server + '/workspaces/' + this.get('id') + '/histograms/' + name;
	},

	getHistogramUrls: function(names) {
		let urls = [];
		for (let i = 0; i < names.length; i++) {
			urls.push(this.getHistogramUrl(names[i]));
		}
		return urls;
	},

	getPullPlotUrl: function() {
		return config.server + '/workspaces/' + this.get('id') + '/pull-plot';
	},

	//
	// converting methods
	//

	filesToCollection: function(files) {
		files.sort();
		let collection = new BaseCollection();
		for (let i = 0; i < files.length; i++) {
			collection.add(new BaseModel({
				name: files[i]
			}));
		}
		return collection;
	},

	//
	// ajax methods
	//

	uploadFiles: function(backgroundFile, patchsetFile, options) {
		let formData = new FormData();
		formData.append('background', backgroundFile.files[0]);
		formData.append('patchset', patchsetFile.files[0]);

		$.ajax(_.extend({}, options, {
			type: 'POST',
			url: config.server + '/workspaces/upload',
			data: formData,
			contentType: false,
			processData: false
		}));
	},

	uploadUrl: function(url, options) {
		$.ajax(_.extend({}, options, {
			type: 'POST',
			url: config.server + '/workspaces/upload/url',
			data: {
				url: url
			}
		}));
	},

	//
	// ajax fetching methods
	//

	fetchContents: function(pattern, options) {
		let url = config.server + '/workspaces/' + this.get('id') + '/contents';
		let data = {};

		// format data
		//
		if (pattern) {
			data.pattern = pattern
		}

		// make request
		//
		$.ajax(_.extend(options, {
			url: url,
			method: 'GET',
			dataType: 'JSON',
			data: data
		}));
	},

	fetchPatches: function(options) {
		let url = config.server + '/workspaces/' + this.get('id') + '/patches';
		let data = {};

		// format data
		//
		if (this.has('background')) {
			data.background = this.get('background')
		}
		if (this.has('patchset')) {
			data.patchset = this.get('patchset')
		}

		// make request
		//
		$.ajax(_.extend(options, {
			url: url,
			method: 'GET',
			dataType: 'JSON',
			data: data
		}));
	},

	fetchChannels: function(options) {
		let url = config.server + '/workspaces/' + this.get('id') + '/channels';
		let data = {};

		// format data
		//
		if (options.patches) {
			data.patches = options.patches.join('_');
		}
		if (this.has('background')) {
			data.background = this.get('background')
		}
		if (this.has('patchset')) {
			data.patchset = this.get('patchset')
		}

		// make request
		//
		$.ajax(_.extend(options, {
			url: url,
			method: 'GET',
			dataType: 'JSON',
			data: data
		}));
	},

	fetchParams: function(options) {
		let url = config.server + '/workspaces/' + this.get('id') + '/params';
		let data = {};

		// format data
		//
		if (options.patches && options.patches.length > 0) {
			data.patches = options.patches.join('_')
		}
		if (this.has('background')) {
			data.background = this.get('background')
		}
		if (this.has('patchset')) {
			data.patchset = this.get('patchset')
		}

		// make request
		//
		$.ajax(_.extend(options, {
			url: url,
			method: 'GET',
			dataType: 'JSON',
			data: data
		}));
	},

	fetchPlots: function(kind, options) {
		switch (kind) {
			case 'histogram':
				this.fetchHistograms(options);
				break;
			case 'pull_plot':
				this.fetchPullPlots(options);
				break;
		}
	},

	fetchHistograms: function(options) {
		let url = config.server + '/workspaces/' + this.get('id') + '/histograms';
		let data = {};

		// format data
		//
		if (options.patches) {
			data.patches = options.patches.join('_');
		}
		if (options.params) {
			data.params = options.params;
		}
		if (this.has('background')) {
			data.background = this.get('background')
		}
		if (this.has('patchset')) {
			data.patchset = this.get('patchset')
		}

		// make request
		//
		$.ajax(_.extend(options, {
			url: url,
			method: 'POST',
			dataType: 'JSON',
			data: data
		}));
	},

	fetchPullPlots: function(options) {
		let url = config.server + '/workspaces/' + this.get('id') + '/pull-plot';
		let data = {};

		// format data
		//
		if (options.patches) {
			data.patches = options.patches.join('_');
		}
		if (options.params) {
			data.params = options.params;
		}
		if (this.has('background')) {
			data.background = this.get('background')
		}
		if (this.has('patchset')) {
			data.patchset = this.get('patchset')
		}

		// make request
		//
		$.ajax(_.extend(options, {
			url: url,
			method: 'POST',
			dataType: 'JSON',
			data: data
		}));
	},

	fetchFit: function(options) {
		let url = config.server + '/workspaces/' + this.get('id') + '/fit';
		let data = {};

		// format data
		//
		if (options.patches) {
			data.patches = options.patches.join('_');
		}
		if (this.has('background')) {
			data.background = this.get('background')
		}
		if (this.has('patchset')) {
			data.patchset = this.get('patchset')
		}

		// make request
		//
		$.ajax(_.extend(options, {
			url: url,
			method: 'GET',
			dataType: 'JSON',
			data: data
		}));
	},

	//
	// binary fetching methods
	//

	fetchBinary: function(url, options) {

		// create get request
		//
		let request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = "arraybuffer";

		// set callbacks
		//
		request.onload = function() {
			let arrayBuffer = request.response;
			let byteArray = new Uint8Array(arrayBuffer);
			options.success(byteArray);
		};
		request.onerror = options.error;

		// perform request
		//
		request.send();
		return request;
	},

	fetchHistogram: function(name, options) {
		this.fetchBinary(this.getHistogramUrl(name), options);
	},

	fetchPullPlot: function(options) {
		this.fetchBinary(this.getPullPlotUrl(name), options);
	}
});