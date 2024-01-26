################################################################################
#                                                                              #
#                                 workspace.py                                 #
#                                                                              #
################################################################################
#                                                                              #
#        This is a model for managing pyhf workspaces.                         #
#                                                                              #
#        Author(s): Abe Megahed                                                #
#                                                                              #
################################################################################
#     Copyright (C) 2023, Data Science Institute, University of Wisconsin      #
################################################################################

import flask
import os
import requests
import urllib.request
import logging
import subprocess
import json
import cabinetry
import pyhf
import numpy as np
import matplotlib
import fnmatch
import shutil
import glob
import tarfile 
from pathlib import Path
from flask import jsonify
from cabinetry.model_utils import prediction

matplotlib.pyplot.switch_backend('Agg')

class Workspace:

	# workspace cache
	workspaces = {}

	#
	# constructor
	#

	def __init__(self, id, background=None, patchset=None):

		"""
		Create a new workspace.

		Parameters:
			id (string): The id of the workspace to create
		"""
		self.id = id
		self.background = background or 'background.json'
		self.patchset = patchset or 'patchset.json'

	#
	# utility methods
	#

	def listdir(self, path, pattern):

		# find list of all paths that match pattern
		results = [y for x in os.walk(path) for y in glob.glob(os.path.join(x[0], (pattern or '*')))]

		# make paths relative to original path
		index = len(path) + 1
		relative_paths = set()
		for result in results:
			relative_paths.add(result[index:])
		paths = list(relative_paths)
		paths.sort()

		return paths

	#
	# uploading methods
	#

	def upload_files(self, background, patchset):

		"""
		Upload the workspace files.

		Parameters:
			background: The background file
			patchset: The patchset file
		"""

		# find workspace directory
		workspaceDir = self.workspace_dir()

		# create workspace folder
		os.mkdir(workspaceDir, mode=0o755)

		# save files to workspace folder
		if (background):
			background.save(self.background_path())
		if (patchset):
			patchset.save(self.patchset_path())

	#
	# downloading methods
	#

	def upload_url(self, url):

		"""
		Download the workspace files from a url.

		Parameters:
			url: The url to download the workspace from
		"""

		# strip query param
		url = url.replace('?view=true', '')

		# check for json urls
		if (url.endswith('.json')):
			self.upload_file_from_url(url)

		# check for archive urls
		elif (url.endswith('.tar') or url.endswith('.tar.gz') or url.endswith('.tgz')):
			self.upload_archive_from_url(url)

		# handle hepdata urls
		else:
			# download file
			contents = requests.get(url)
			response = json.loads(contents.text)

			if ('file_contents' in response):

				# look up file type
				file_type = response['file_contents']

				# download workspace to folder
				if (file_type != 'Binary'):
					self.upload_file_from_hepdata(url)
				else:
					self.upload_archive_from_hepdata(url)

	#
	# url uploading methods
	#

	def upload_file_from_url(self, url):

		"""
		Download the workspace file from a url.

		Parameters:
			url: The url to download the workspace from
		"""

		import urllib
		workspaceDir = 'public/workspaces/' + str(self.id)

		# make workspace directory
		os.mkdir(workspaceDir)

		# download file to workspace directory
		filename = workspaceDir + '/' + os.path.basename(url)
		urllib.request.urlretrieve(url, filename)

	def upload_archive_from_url(self, url):

		"""
		Download the workspace archive from a url.

		Parameters:
			url: The url to download the workspace from
		"""

		from pyhf.contrib.utils import download
		workspaceDir = 'public/workspaces/' + str(self.id)

		# make workspace directory
		os.mkdir(workspaceDir)

		# download file to workspace directory
		filename = workspaceDir + '/' + os.path.basename(url)
		urllib.request.urlretrieve(url, filename)

		# open archive 
		archive = tarfile.open(filename)

		# extract archive to workspace
		archive.extractall(workspaceDir)

		# close archive
		archive.close()

	#
	# hepdata uploading methods
	#

	def upload_file_from_hepdata(self, url):

		"""
		Download the workspace file from a url.

		Parameters:
			url: The url to download the workspace from
		"""

		import urllib
		workspaceDir = 'public/workspaces/' + str(self.id)

		# make workspace directory
		os.mkdir(workspaceDir)

		# download file to workspace directory
		filename = workspaceDir + '/background.json'
		urllib.request.urlretrieve(url + '?view=true', filename)

	def upload_archive_from_hepdata(self, url):

		"""
		Download the workspace archive from a url.

		Parameters:
			url: The url to download the workspace from
		"""

		from pyhf.contrib.utils import download
		workspaceDir = 'public/workspaces/' + str(self.id)

		# download workspace to workspace directory
		download(url + '?view=true', workspaceDir)

	#
	# querying methods
	#

	def workspaces_dir(self):

		"""
		Get the path to directory containing all workspaces.

		Returns:
			string
		"""

		return os.path.join(flask.current_app.root_path, flask.current_app.config['UPLOAD_FOLDER'])

	def workspace_dir(self):

		"""
		Get the path to the directory containing this specific workspace.

		Returns:
			string
		"""

		return os.path.join(self.workspaces_dir(), str(self.id))

	def histograms_dir(self):

		"""
		Get the path to this workspace's histograms directory.

		Returns:
			string
		"""

		return os.path.join(self.workspace_dir(), 'histograms')

	def background_path(self):

		"""
		Get the path to the main workspace json file.

		Returns:
			string
		"""

		return os.path.join(self.workspace_dir(), self.background)

	def patchset_path(self):

		"""
		Get the path to the optional workspace patchset file.

		Returns:
			string
		"""

		return os.path.join(self.workspace_dir(), self.patchset)

	def histogram_path(self, channel):

		"""
		Get the path to a particular histogram file.

		Returns:
			string
		"""

		return os.path.join(self.histograms_dir(), channel + '.pdf')

	def pull_plot_path(self):

		"""
		Get the path to a particular histogram file.

		Returns:
			string
		"""

		return os.path.join(self.workspace_dir(), 'pull-plot.pdf')

	#
	# getting methods
	#

	def get_workspace(self):

		"""
		Get a new workspace associated with an id.

		Parameters:
			id (string): The id of the workspace to create
		"""

		# check if model is in the cache
		if (not self.id in Workspace.workspaces.values()):

			# construct a workspace from a background-only model and a signal hypothesis
			background_path = self.background_path()
			modelspec = json.load(open(background_path))
			Workspace.workspaces[self.id] = pyhf.Workspace(modelspec)

		return Workspace.workspaces[self.id]

	def get_contents(self, pattern):

		"""
		Get a workspace's contents.

		Parameters:
			id (string): The id of the workspace to get the contents of.
		"""

		# find workspace directory
		workspaceDir = 'public/workspaces/' + str(self.id)

		# list contents of workspace directory
		return self.listdir(workspaceDir, pattern)

	def get_patches(self):

		"""
		Get information about a workspace's patches.

		Returns:
			object: An object containing patch metadata and values
		"""

		# get path
		patchset_path = self.patchset_path()

		# check if file exists
		if not os.path.isfile(patchset_path):
			return False

		# run command
		command = flask.current_app.config['APP_JQ'] + " -r '.patches[].metadata.name' " + patchset_path + " | awk -F_ '$3-$4==130 {print $0}'"
		output = subprocess.check_output(command, shell=True)

		# parse output into an array of patches which
		# each consist of an array of strings and ints
		array = []
		lines = output.decode().split('\n')
		for line in lines:
			if (line):
				array.append(self.parse_patches(line))

		# parse file contents
		file = open(patchset_path, "r")
		contents = file.read()
		json_contents = json.loads(contents)

		return {
			'metadata': json_contents['metadata'] if json_contents and 'metadata' in json_contents.keys() else None,
			'values': array
		};

	def get_channels(self, patches=None):

		"""
		Get information about a workspace's channels.

		Parameters:
			patches (array): The patches to apply before getting the channels.
		Returns:
			object: An object containing patch metadata and values
		"""

		# construct a workspace from a background-only model and a signal hypothesis
		workspace = self.get_workspace()

		# apply patchset
		if (patches):
			patchset_path = self.patchset_path()
			patchset = pyhf.PatchSet(json.load(open(patchset_path)))
			workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

		# construct the probability model and observations
		model, data = cabinetry.model_utils.model_and_data(workspace)

		# output model parameters
		return model.config.channels

	def get_params(self, patches=None):

		"""
		Get information about a workspace's parameters.

		Parameters:
			patches (array): The patches to apply before getting the channels.
		Returns:
			object: An object containing the workspace parameter values
		"""

		# construct a workspace from a background-only model and a signal hypothesis
		workspace = self.get_workspace()

		# apply patchset
		if (patches):
			patchset_path = self.patchset_path()
			patchset = pyhf.PatchSet(json.load(open(patchset_path)))
			workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

		# construct the probability model and observations
		model, data = cabinetry.model_utils.model_and_data(workspace)

		# return model parameters
		return {
			"parameters": model.config.par_names,
			"suggested_init": model.config.suggested_init(),
			"suggested_bounds": model.config.suggested_bounds(),
			"suggested_fixed": model.config.suggested_fixed(),
			"impacts": self.get_param_impacts(model)
		}

	def get_fit(self, patches=None):

		"""
		Get the set of parameters that best fits the model data.

		Parameters:
			patches (array): The patches to apply before peforming the fit.
		Returns:
			array: An array containing the fitted workspace parameter values
		"""

		# construct a workspace from a background-only model and a signal hypothesis
		workspace = self.get_workspace()

		# apply patches
		if (patches):
			patchset_path = self.patchset_path()
			patchset = pyhf.PatchSet(json.load(open(patchset_path)))
			workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

		# construct the probability model and observations
		model, data = cabinetry.model_utils.model_and_data(workspace)

		# fit the model to the observed data
		results = cabinetry.fit.fit(model, data)

		# return fit results
		return {
			'bestfit': results.bestfit.tolist(),
			'uncertainty': results.uncertainty.tolist(),
			'labels': results.labels
		}

	def get_plots(self, dirname):

		"""
		Get a list of the plots in this workspace.

		Parameters:
			dirname: The directory to check for plots
		Returns:
			array: An array containing the names of plots
		"""

		# get list of files in workspace directory
		files = os.listdir(dirname)

		# return list of pdf files
		plots = fnmatch.filter(files, '*.pdf')

		# strip file extensions
		names = []
		for plot in plots:
			names.append(plot.replace('.pdf', ''))

		return names

	#
	# plotting methods
	#

	def create_histograms(self, patches, params):

		"""
		Create a set of histogram plots.

		Parameters:
			patches (array): The patches to apply.
			params (array): The parameters to apply.
		Returns:
			array: An array containing the list of histogram names
		"""

		# get paths
		workspace_dir = self.workspace_dir()
		histograms_dir = self.histograms_dir()
		background_path = self.background_path()
		patchset_path = self.patchset_path()

		# remove previous histograms
		if os.path.isdir(histograms_dir):
			shutil.rmtree(histograms_dir)

		# construct a workspace
		workspace = self.get_workspace()

		# apply patches
		if (patches):
			patchset = pyhf.PatchSet(json.load(open(patchset_path)))
			workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

		# construct the probability model and observations
		model, data = cabinetry.model_utils.model_and_data(workspace)

		# add parameters to model
		if (params):
			prefit_model = self.apply_model_params(model, params)
		else:
			prefit_model = prediction(model)

		# produce visualizations of the pre-fit model and observed data
		cabinetry.visualize.data_mc(prefit_model, data, figure_folder=histograms_dir)

		# return list of histograms in this workspace
		return self.get_plots(histograms_dir)

	def create_pull_plot(self, patches, params):

		"""
		Create a pull plot.

		Parameters:
			patches (array): The patches to apply.
			params (array): The parameters to apply.
		Returns:
			array: An array containing the list of pull plot names
		"""

		# construct a workspace from a background-only model and a signal hypothesis
		workspace = self.get_workspace()

		# apply patches
		if (patches):
			patchset_path = self.patchset_path()
			patchset = pyhf.PatchSet(json.load(open(patchset_path)))
			workspace = patchset.apply(workspace, "_".join(str(x) for x in patches))

		# construct the probability model and observations
		model, data = cabinetry.model_utils.model_and_data(workspace)

		# add parameters to model
		if (params):
			prefit_model = self.apply_model_params(model, params)
		else:
			prefit_model = prediction(model)

		# produce visualizations of the pre-fit model and observed data
		cabinetry.visualize.data_mc(prefit_model, data)

		# fit the model to the observed data
		fit_results = cabinetry.fit.fit(model, data)

		# produce pull plot
		plot = cabinetry.visualize.plot_result.pulls(fit_results.bestfit, fit_results.uncertainty, fit_results.labels)
		plot.savefig(os.path.join(self.workspace_dir(), 'pull-plot.pdf'))

		# return plots in this workspace
		return self.get_plots(self.workspace_dir())

	#
	# static utility methods
	#

	@staticmethod
	def get_fit_results(model, params):

		"""
		Get the set of parameter values for a best fit.

		Parameters:
			model (object): The workspace model.
			params (array): The parameters to apply to the model.
		Returns:
			model (object): The fitted parameter values
		"""

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

	@staticmethod
	def apply_model_params(model, params):

		"""
		Create a model that has had a set of parameters applied

		Parameters:
			model (object): The workspace model.
			params (array): the parameters to apply to the model.
		Returns:
			model (object): The workspace model after params have been applied
		"""

		# get a custom fit_results object that contains all relevant information
		custom_parameters = Workspace.get_fit_results(model, params)

		# print(model.config.parameters)
		# print(custom_parameters)

		# produce visualizations of the pre-fit model and observed data
		return cabinetry.model_utils.prediction(model, fit_results = custom_parameters, label="custom_parameters")

	@staticmethod
	def parse_patches(string):

		"""
		Parses a parameter string into an array of values.  For example:
		"sbottom_1000_131_1" would be parsed into ["sbottom", 1000, 131, 1]

		Parameters:
			string: A parameter string with values separated by underscores
		Returns:
			array: The array of integer and string values
		"""

		# parse string into an array of string and integer values
		words = string.split('_')
		terms = []
		for word in words:
			term = int(word) if word.isnumeric() else word
			terms.append(term)

		# return array of values
		return terms

	@staticmethod
	def get_param_impacts(model):

		"""
		Get a list of estimations of the parameters' impacts on the model.

		Parameters:
			model: The background file
		Returns:
			array: An array of values [0 to 1] of the parameter impacts
		"""

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
