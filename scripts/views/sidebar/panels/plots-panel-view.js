/******************************************************************************\
|                                                                              |
|                            plots-panel-view.js                               |
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

export default BaseView.extend({

	//
	// attributes
	//

	className: 'plots panel',

	template: _.template(`
		<div class="header">
			<label><i class="fa rotated flipped fa-chart-bar"></i>Plots</label>
		</div>

		<div class="radio-buttons">
			<div class="radio-inline">
				<label><input type="radio" name="plot" value="histogram" checked>Histogram</label>
			</div>

			<div class="radio-inline">
				<label><input type="radio" name="plot" value="pull_plot">Pull Plot</label>
			</div>
		</div>
	`),

	events: {
		'click input': 'onClickInput'
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.$el.find('input:checked').val();
	},

	//
	// mouse event handling methods
	//

	onClickInput: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('plot');
		}
	}
});