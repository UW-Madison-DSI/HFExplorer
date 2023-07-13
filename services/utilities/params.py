################################################################################
#                                                                              #
#                                  params.py                                   #
#                                                                              #
################################################################################
#                                                                              #
#        This script is used to find info about pyhf model params.             #
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

def get_param_impacts(model):
	param_values = cabinetry.model_utils.asimov_parameters(model)
	param_uncertainty = cabinetry.model_utils.prefit_uncertainties(model)
	data_nominal = model.main_model.expected_data(param_values)

	impact_per_parameter = []

	for par_idx, par_name in enumerate(model.config.par_names):

		# vary parameter up and down within uncertainty and get model prediction
		param_values_up = param_values.copy()
		param_values_up[par_idx] += param_uncertainty[par_idx]
		data_up = model.main_model.expected_data(param_values_up)

		param_values_down = param_values.copy()
		param_values_down[par_idx] -= param_uncertainty[par_idx]
		data_down = model.main_model.expected_data(param_values_down)

		# get average (over bins) relative impact on model prediction of parameter
		avg_rel_impact = np.mean((data_up - data_down) / (2 * data_nominal))
		impact_per_parameter.append(abs(avg_rel_impact))

	return impact_per_parameter

################################################################################
#                                     main                                     #
################################################################################

# construct a workspace from a background-only model and a signal hypothesis
workspace = pyhf.Workspace(json.load(open("background.json")))

# apply patchset
patches = None
if (patches):
	patchset = pyhf.PatchSet(json.load(open("patchset.json")))
	workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

# construct the probability model and observations
model, data = cabinetry.model_utils.model_and_data(workspace)


# find model parameters
params = {
	"parameters": model.config.par_names,
	"suggested_init": model.config.suggested_init(),
	"suggested_bounds": model.config.suggested_bounds(),
	"suggested_fixed": model.config.suggested_fixed(),
	"impacts": get_param_impacts(model)
}

# output model parameters
print(json.dumps(params))