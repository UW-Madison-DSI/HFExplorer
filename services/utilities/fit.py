
################################################################################
#                                                                              #
#                                    fit.py                                    #
#                                                                              #
################################################################################
#                                                                              #
#        This script is used to perform a fit and ouput the resulting          #
#        parameter values and uncertainties.                                   #
#                                                                              #
#        Author(s): Abe Megahed                                                #
#                                                                              #
################################################################################
#     Copyright (C) 2023, Data Science Institute, University of Wisconsin      #
################################################################################

import json
import cabinetry
import pyhf
from cabinetry.model_utils import prediction
import io

def output_numbers(f, numbers):
	count = 0
	print('[', file=f)
	for number in numbers:
		print('\t\t' + str(number), end='', file=f)
		count += 1
		if (count < len(numbers)):
			print(', ', file=f)
	print('\n\t]', end='', file=f)

def output_strings(f, strings):
	count = 0
	print('[', file=f)
	for string in strings:
		print('\t\t"' + string + '"', end='', file=f)
		count += 1
		if (count < len(strings)):
			print(', ', file=f)
	print('\n\t]', end='', file=f)

# print results in json format
def output_results(f, results):
	print('{', file=f)

	print('\t"bestfit": ', end='', file=f)
	output_numbers(f, results.bestfit);
	print(',\t', file=f)

	print('\t"uncertainty": ', end='', file=f)
	output_numbers(f, results.uncertainty);
	print(',\t', file=f)

	print('\t"labels": ', end='', file=f)
	output_strings(f, results.labels);
	print('\n', end='', file=f)

	print('}', end='', file=f)

################################################################################
#                                     main                                     #
################################################################################

# construct a workspace from a background-only model and a signal hypothesis
workspace = pyhf.Workspace(json.load(open("background.json")))

patches = None
if (patches):
	patchset = pyhf.PatchSet(json.load(open("patchset.json")))
	workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

# construct the probability model and observations
model, data = cabinetry.model_utils.model_and_data(workspace)

# fit the model to the observed data
fit_results = cabinetry.fit.fit(model, data)

# output results to file
f = open("fit.json", "w")
output_results(f, fit_results)
f.close();