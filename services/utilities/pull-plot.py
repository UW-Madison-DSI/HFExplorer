################################################################################
#                                                                              #
#                                pull-plot.py                                  #
#                                                                              #
################################################################################
#                                                                              #
#        This script is used to create pull plots for a pyhf workspace.        #
#                                                                              #
#        A workspace consists of a background json file and, optionally,       #
#        a patchset json file.  Plots produced by cabinetry are stored         #
#        in a "figures" directory and are ouput as pdf files.                  #
#                                                                              #
#        Author(s): Abe Megahed                                                #
#                                                                              #
################################################################################
#     Copyright (C) 2023, Data Science Institute, University of Wisconsin      #
################################################################################

import json
import cabinetry
import pyhf
import numpy as np
from cabinetry.model_utils import prediction

def get_fit_results(model, params):

	# start with default pre-fit parameter values for everything
	param_values = cabinetry.model_utils.asimov_parameters(model)

	# corresponding default pre-fit uncertainties
	param_uncertainty = cabinetry.model_utils.prefit_uncertainties(model)

	# diagonal correlation matrix
	corr_mat = np.zeros(shape=(len(param_values), len(param_values)))
	np.fill_diagonal(corr_mat, 1.0)

	# update central values of parameters as specified in params dict
	labels = model.config.par_names
	for k, v in params.items():
		idx = cabinetry.model_utils._parameter_index(k, labels)  # index of parameter
		if (idx != None):
			param_values[idx] = v

	return cabinetry.fit.FitResults(param_values, param_uncertainty, labels, corr_mat, np.nan)

def apply_model_params(model, params):

	# get a custom fit_results object that contains all relevant information
	custom_parameters = get_fit_results(model, params)

	# print(model.config.parameters)
	# print(custom_parameters)

	# produce visualizations of the pre-fit model and observed data
	return cabinetry.model_utils.prediction(model, fit_results = custom_parameters, label="custom_parameters")

################################################################################
#                                     main                                     #
################################################################################

# parse model spec
modelspec = json.load(open("background.json"))

# construct a workspace from a background-only model and a signal hypothesis
workspace = pyhf.Workspace(modelspec)

# apply patchset
patches = None
if (patches):
	patchset = pyhf.PatchSet(json.load(open("patchset.json")))
	workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

# construct the probability model and observations
model, data = cabinetry.model_utils.model_and_data(workspace)

# add parameters to model
params = None
if (params):
	prefit_model = apply_model_params(model, params)
else:
	prefit_model = prediction(model)

# produce visualizations of the pre-fit model and observed data
cabinetry.visualize.data_mc(prefit_model, data)

# fit the model to the observed data
fit_results = cabinetry.fit.fit(model, data)

# produce pull plot
plot = cabinetry.visualize.plot_result.pulls(fit_results.bestfit, fit_results.uncertainty, fit_results.labels)
plot.savefig("pull-plot.pdf")