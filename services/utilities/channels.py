################################################################################
#                                                                              #
#                                 channels.py                                  #
#                                                                              #
################################################################################
#                                                                              #
#        This script is used to find info about pyhf workspace channels.       #
#                                                                              #
#        Author(s): Abe Megahed                                                #
#                                                                              #
################################################################################
#     Copyright (C) 2023, Data Science Institute, University of Wisconsin      #
################################################################################

import json
import cabinetry
import pyhf

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

# output model parameters
print(model.config.channels)