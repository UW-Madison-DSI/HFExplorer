/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the workspace sidebar view and its various panels.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import PanelsView from '../../views/layout/panels-view.js';
import ActionsPanelView from '../../views/sidebar/panels/actions-panel-view.js';
import PlotsPanelView from '../../views/sidebar/panels/plots-panel-view.js';
import PatchesPanelView from '../../views/sidebar/panels/patches-panel-view.js';
import ChannelsPanelView from '../../views/sidebar/panels/channels-panel-view.js';
import ParamsPanelView from '../../views/sidebar/panels/params-panel-view.js';

export default PanelsView.extend({

	//
	// attributes
	//

	panels: ['plots', 'patches', 'channels', 'params'],

	//
	// querying methods
	//

	visible: function() {
		return {
			plots: true,
			patches: this.options.patches != null,
			channels: true,
			params: true,
			options: true
		}
	},

	//
	// panel rendering methods
	//

	showPlots: function(plots, options) {
		this.options.plots = plots;
		this.showPanel('plots', options);
	},

	showPatches: function(patches, options) {
		this.options.patches = patches;
		this.showPanel('patches', options);
	},

	showChannels: function(channels, options) {
		this.options.channels = channels;
		this.showPanel('channels', options);
	},

	showParams: function(params, options) {
		this.options.params = params;
		this.showPanel('params', options);
	},

	showPanel: function(panel, options) {

		// if panel has already been rendered, then show
		//
		if (this.hasChildView(panel)) {
			this.getChildView(panel).show();
			return;
		}

		// show specified panel
		//
		switch (panel) {
			case 'actions':
				this.showActionsPanel();
				break;
			case 'plots':
				this.showPlotsPanel(options);
				break;
			case 'patches':
				this.showPatchesPanel(options);
				break;
			case 'channels':
				this.showChannelsPanel(options);
				break;
			case 'params':
				this.showParamsPanel(options);
				break;
		}
	},

	showActionsPanel: function() {
		this.showChildView('actions', new ActionsPanelView());
	},

	showPlotsPanel: function(options) {
		this.showChildView('plots', new PlotsPanelView({

			// options
			//
			patches: this.options.patches,
			selected: options? options.selected : undefined,

			// callbacks
			//
			onchange: () => {
				this.options.onchange('plot');
			}
		}));
	},

	showPatchesPanel: function(options) {
		if (this.options.patches) {
			this.showChildView('patches', new PatchesPanelView({

				// options
				//
				patches: this.options.patches,
				selected: options? options.selected : undefined,

				// callbacks
				//
				onchange: () => {
					this.options.onchange('patch');
				}
			}));
		}
	},

	showChannelsPanel: function(options) {
		if (this.options.channels) {
			this.showChildView('channels', new ChannelsPanelView({

				// options
				//
				channels: this.options.channels,
				selected: options? options.selected : undefined,

				// callbacks
				//
				onchange: () => {
					this.options.onchange('channel');
				}
			}));
		}
	},

	showParamsPanel: function(options) {
		if (this.options.params) {
			this.showChildView('params', new ParamsPanelView({

				// options
				//
				params: this.options.params,
				selected: options? options.selected : undefined,

				// callbacks
				//
				onchange: () => {
					this.options.onchange('param');
				}
			}));
		}
	}
});