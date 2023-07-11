/******************************************************************************\
|                                                                              |
|                                 plot-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing plots.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import PdfView from '../../views/mainbar/pdf-view.js';

export default PdfView.extend({

	//
	// attributes
	//

	className: 'plot',

	//
	// setting methods
	//

	setPlotKind: function(plotKind) {
		switch (plotKind) {
			case 'histogram':
				this.$el.addClass('histogram');
				this.$el.removeClass('pull-plot');
				break;
			case 'pull_plot':
				this.$el.removeClass('histogram');
				this.$el.addClass('pull-plot');
				break;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// load model
		//
		if (this.model && this.model.is_loaded) {
			this.loadFile(this.model);
		}

		// apply preferences
		//
		if (this.options.preferences) {
			this.options.preferences.applyTo(this);
		}
	},

	showHistogram: function(channel) {
		this.showSpinner();

		// fetch and show histogram pdf
		//
		this.model.fetchHistogram(channel, {

			// callbacks
			//
			success: (data) => {
				this.hideSpinner();
				this.setPlotKind('histogram');
				this.showPdf(data);
			}
		});
	},

	showPullPlot: function() {
		this.showSpinner();

		// fetch and show pull plot pdf
		//
		this.model.fetchPullPlot({

			// callbacks
			//
			success: (data) => {
				this.hideSpinner();
				this.setPlotKind('pull_plot');
				this.showPdf(data);
			}
		});
	},
});