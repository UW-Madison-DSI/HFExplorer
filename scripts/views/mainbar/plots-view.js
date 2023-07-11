/******************************************************************************\
|                                                                              |
|                                plots-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing a collection of plots.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/layout/panels-view.js';
import Loadable from '../../views/behaviors/effects/loadable.js';
import PlotView from '../../views/mainbar/plot-view.js';

export default BaseView.extend(_.extend({}, Loadable, {

	//
	// attributes
	//

	className: 'plots',

	//
	// rendering methods
	//

	regions: function() {
		let regions = {};
		for (let i = 0; i < this.options.channels.length; i++) {
			let panel = this.options.channels[i];
			regions[panel] = {
				el: '.' + panel.replace(/_/g, '-'),
				replaceElement: this.replaceElement
			};
		}
		return regions;
	},

	getTemplate: function() {
		let html = '';
		for (let i = 0; i < this.options.channels.length; i++) {
			let channel = this.options.channels[i];
			let className = channel.replace(/_/g, '-');
			html += '<div class="' + className + '"></div>';
		}
		return template(html);
	},

	onRender: function() {
		let regions = Object.keys(this.regions);
		for (let i = 0; i < regions.length; i++) {
			let region = regions[i];
			let plotView = new PlotView({
				model: this.model
			});
			this.showChildView(region, plotView);
			plotView.showHistogram(region);
		}
	}
}));