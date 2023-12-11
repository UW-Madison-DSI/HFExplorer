################################################################################
#                                                                              #
#                                   plot.py                                    #
#                                                                              #
################################################################################
#                                                                              #
#        This script is used to create histograms for a pyhf workspace.        #
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
import time

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
t1 = time.perf_counter()

# parse model spec
modelspec = json.load(open("background.json"))

# construct a workspace from a background-only model and a signal hypothesis
t2 = time.perf_counter()
workspace = pyhf.Workspace(modelspec)

# load patchset
t3 = time.perf_counter()
patches = ['sbottom', 1000, 131, 1]
if (patches):
	patchset = json.load(open("patchset.json"))

# apply patchset
t4 = time.perf_counter()
if (patches):
	patchset = pyhf.PatchSet(patchset)
	workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

# construct the probability model and observations
t5 = time.perf_counter()
model, data = cabinetry.model_utils.model_and_data(workspace)

# add parameters to model
t6 = time.perf_counter()
params = None
if (params):
	prefit_model = apply_model_params(model, params)
else:
	prefit_model = prediction(model)

# produce visualizations of the pre-fit model and observed data
t7 = time.perf_counter()
cabinetry.visualize.data_mc(prefit_model, data)

# done!
t8 = time.perf_counter()

# compute times
model_loading_time = t2 - t1
workspace_construction_time = t3 - t2
patchset_loading_time = t4 - t3
patchset_applying_time = t5 - t4
model_construction_time = t6 - t5
applying_params_time = t7 - t6
visualization_time = t8 - t7
total_elapsed_time = t8 - t1

# print out timing
print("model loading time = ", model_loading_time)
print("workspace construction time = ", workspace_construction_time)
print("patchset loading time = ", patchset_loading_time)
print("patchset applying time = ", patchset_applying_time)
print("model construction time = ", model_construction_time)
print("model apply params time = ", applying_params_time)
print("visualization time = ", visualization_time)
print("total elapsed time = ", total_elapsed_time)

