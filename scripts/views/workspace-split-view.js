/******************************************************************************\
|                                                                              |
|                           workspace-split-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level view of our application.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import SplitView from '../views/layout/split-view.js';
import PlotView from '../views/mainbar/plot-view.js';
import PlotsView from '../views/mainbar/plots-view.js';
import SideBarView from '../views/sidebar/sidebar-view.js';
import Browser from '../utilities/web/browser.js';

export default SplitView.extend({

	//
	// attributes
	//

	orientation: $(window).width() < 960? 'vertical': 'horizontal',
	flipped: false,
	sizes: [40, 60],

	//
	// getting methods
	//

	getMainBarView: function() {
		return new PlotView({
			model: this.model,
			parent: this
		});
	},

	getSideBarView: function() {
		return new SideBarView({
			parent: this,

			// callbacks
			//
			onchange: (attribute) => this.onChange(attribute)
		});
	},

	getPlot: function() {
		if (this.hasChildView('sidebar plots')) {
			return this.getChildView('sidebar plots').getValue();
		}
	},

	getPatches: function() {
		if (this.hasChildView('sidebar patches')) {
			return this.getChildView('sidebar patches').getValues();
		} else {
			return [];
		}
	},

	getChannels: function() {
		if (this.hasChildView('sidebar channels')) {
			return this.getChildView('sidebar channels').getValues();
		}
	},

	getSelectedChannels: function() {
		if (this.hasChildView('sidebar channels')) {
			return this.getChildView('sidebar channels').getSelected();
		}
	},

	getParams: function() {
		if (this.hasChildView('sidebar params')) {
			return this.getChildView('sidebar params').getValues();
		}
	},

	getPlotUrls: function() {
		switch (this.getPlot()) {
			case 'histogram':
				return this.model.getHistogramUrls(this.getSelectedChannels());
			case 'pull_plot':
				return [this.model.getPullPlotUrl()];
		}
	},

	//
	// setting methods
	//

	setParams: function(params) {
		this.getChildView('sidebar params').setValues(params);
	},

	//
	// methods
	//

	fit: function() {

		// if showing mainbar, then show spinner
		//
		if (this.hasChildView('mainbar')) {
			this.getChildView('mainbar').showSpinner();
		}

		this.model.fetchFit({
			patches: this.getPatches(),

			// callbacks
			//
			success: (data) => {
				this.setParams(data.bestfit);

				// update view
				//
				this.onChange('param');
			}
		})
	},

	reset: function() {
		this.setParams(this.params.suggested_init);

		// update view
		//
		this.onChange('param');
	},

	download: function() {
		Browser.download(this.getPlotUrls());
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SplitView.prototype.onRender.call(this);

		// if showing mainbar, then show spinner
		//
		if (this.hasChildView('mainbar')) {
			this.getChildView('mainbar').showSpinner();
		}

		// show patches in sidebar
		//
		this.showPatches({

			// callbacks
			//
			success: () => {
				this.showParams({

					// options
					//
					patches: this.getPatches(),

					// callbacks
					//
					success: () => {
						this.showPlot();
					}
				});
			}
		});
	},

	showPlot: function() {
		switch (this.getPlot()) {
			case 'histogram':
				this.showParams({

					// callbacks
					//
					success: () => {
						this.showChannels({
							patches: this.getPatches()
						});
					}
				});
				break;
			case 'pull_plot':
				this.showPullPlot();
				break;
		}
	},

	showPatches: function(options) {
		this.model.fetchPatches({

			// callbacks
			//
			success: (patches) => {
				let values = null;

				if (patches.values && patches.values.length > 0) {

					// show patches sidebar panel
					//
					this.getChildView('sidebar').showPatches(patches);

					// show patches in sidebar
					//
					values = this.getChildView('sidebar patches').getValues();
				}

				// perform callback
				//
				if (options && options.success) {
					options.success(values);
				}
			}
		});
	},

	showParams: function(options) {

		// if showing mainbar, then show spinner
		//
		if (this.hasChildView('mainbar')) {
			this.getChildView('mainbar').showSpinner();
		}

		// show params
		//
		this.model.fetchParams({

			// options
			//
			patches: options? options.patches : [],

			// callbacks
			//
			success: (params) => {
				this.params = params;
				this.getChildView('sidebar').showParams(params);

				// perform callback
				//
				if (options && options.success) {
					options.success(params);
				}
			},
			error: () => {

				// perform callback
				//
				if (options && options.success) {
					options.success([]);
				}
			}
		});
	},

	showChannels: function() {

		// if showing mainbar, then show spinner
		//
		if (this.hasChildView('mainbar')) {
			this.getChildView('mainbar').showSpinner();
		}

		// fetch channels to show
		//
		this.model.fetchHistograms({

			// options
			//
			patches: this.getPatches(),
			params: this.getParams(),

			// callbacks
			//
			success: (channels) => {
				if (this.isDestroyed()) {
					return;
				}

				// show channels in sidebar panel
				//
				if (channels.length > 0) {
					this.getChildView('sidebar').showChannels(channels, {
						selected: this.getChannels()
					});
				}

				// show channels
				//
				if (channels.length > 0) {
					this.showHistograms();
				} else {

					// show dialog
					//
					application.confirm({
						icon: 'fa fa-desktop',
						title: 'Workspace Error',
						message: "Plots not found.",

						accept: () => {

							// go to home view
							//
							application.navigate('/', {
								trigger: true
							});
						}
					})
				}
			}
		});
	},

	showSinglePlot: function() {
		this.showChildView('mainbar', new PlotView({
			model: this.model
		}));
	},

	showMultiPlot: function(channels) {
		this.showChildView('mainbar', new PlotsView({
			model: this.model,
			channels: channels
		}));
	},

	showHistogram: function(channel) {

		// configure sidebar
		//
		this.getChildView('sidebar channels').show();
		this.getChildView('sidebar params').show();

		// configure mainbar
		//
		this.showSinglePlot();

		// show plot
		//
		this.getChildView('mainbar').showHistogram(channel);
	},

	showHistograms: function() {
		let channels = this.getSelectedChannels();
		if (channels.length == 1) {
			this.showHistogram(channels[0]);
		} else {

			// configure sidebar
			//
			this.getChildView('sidebar channels').show();
			this.getChildView('sidebar params').show();

			// configure mainbar
			//
			this.showMultiPlot(channels);
		}
	},

	showPullPlot: function() {

		// configure sidebar
		//
		this.getChildView('sidebar channels').hide();
		this.getChildView('sidebar params').hide();

		// configure mainbar
		//
		this.showSinglePlot();

		// fetch and display
		//
		this.getChildView('mainbar').showSpinner();
		this.model.fetchPullPlots({

			// options
			//
			patches: this.getPatches(),
			params: this.getParams(),

			// callbacks
			//
			success: () => {
				this.getChildView('mainbar').showPullPlot();
			}
		});
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {
		switch (attribute) {
			case 'plot': {
				this.showPlot();
				break;
			}
			case 'patch': {
				this.showPlot();
				break;
			}
			case 'channel': {
				this.showHistograms();
				break;
			}
			case 'param': {
				this.showPlot();
				break;
			}
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {
		if (this.hasChildView('mainbar')) {
			this.getChildView('mainbar').onResize();
		}
	}
});