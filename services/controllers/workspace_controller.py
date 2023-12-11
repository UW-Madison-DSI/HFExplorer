################################################################################
#                                                                              #
#                           workspace_controller.py                            #
#                                                                              #
################################################################################
#                                                                              #
#        This controller is used to handle requests for workspaces.            #
#                                                                              #
#        Author(s): Abe Megahed                                                #
#                                                                              #
################################################################################
#     Copyright (C) 2023, Data Science Institute, University of Wisconsin      #
################################################################################

from models.workspace import Workspace
from flask import request, Response, make_response, send_file
from pyhf.contrib.utils import download
import random
import logging
import requests

class WorkspaceController:

	#
	# uploading methods
	#

	@staticmethod
	def post_upload_files():

		"""
		Uploads a workspace and (optionally) a patchset file.

		Parameters:
			request (Request): The request object
		Returns:
			Response: Result status code
		"""

		# create new workspace
		id = random.randint(0, 999999)
		workspace = Workspace(id)

		# get request's file parameters
		background = request.files['background'] if 'background' in request.files else None;
		patchset = request.files['patchset'] if 'patchset' in request.files else None;

		# upload workspace files
		workspace.upload_files(background, patchset)

		# return workspace object / id
		return {
			'id': id
		}

	@staticmethod
	def post_upload_url():

		# parse params
		url = request.values.get('url')

		# create new workspace
		id = random.randint(0, 999999)
		workspace = Workspace(id)

		# upload workspace from url
		workspace.upload_url(url)

		return {
			'id': id
		}

	#
	# plotting methods
	#

	@staticmethod
	def post_histograms(id, patches, params):

		"""
		Creates a set of histogram plots.

		Parameters:
			id (string): The workspace id
		Returns:
			string[]: A list of the generated histogram plots
		"""

		# create histograms
		histograms = Workspace(id).create_histograms(patches, params)

		# check for return value
		return histograms if histograms else Response('No histograms.', status=404)

	@staticmethod
	def post_pull_plot(id, patches, params):

		"""
		Creates a set of pull plots.

		Parameters:
			id (string): The workspace id
		Returns:
			string[]: The names of the generated pull plots
		"""

		# create histograms
		pull_plots = Workspace(id).create_pull_plot(patches, params)

		# check for return value
		return pull_plots if pull_plots else Response('No pull plots.', status=404)

	#
	# getting methods
	#

	@staticmethod
	def get_patches(id):

		"""
		Returns a list of the workspace's patches.

		Parameters:
			id (string): The workspace id
		Returns:
			string[]: A list of the workspace's patches
		"""

		# get workspace patches
		patches = Workspace(id).get_patches()

		# check for return value
		return patches if patches else []

	@staticmethod
	def get_channels(id, patches=None):

		"""
		Returns a list of the workspace's channels.

		Parameters:
			id (string): The workspace id
		Returns:
			string[]: A list of the workspace's channels
		"""

		# get workspace channels
		channels = Workspace(id).get_channels(patches)

		# check for return value
		return channels if channels else Response('No channels.', status=404)

	@staticmethod
	def get_params(id, patches):

		"""
		Returns a list of the workspace's parameters.

		Parameters:
			id (string): The workspace id
		Returns:
			string[]: A list of the workspace's parameters
		"""

		# get workspace parameters
		params = Workspace(id).get_params(patches)

		# check for return value
		return params if params else Response('No params.', status=404)

	@staticmethod
	def get_histogram(id, channel):

		"""
		Returns a workspace's histogram for a particular channel.

		Parameters:
			id (string): The workspace id
		Returns:
			object: A histogram plot.
		"""

		# return binary file contents
		return send_file(Workspace(id).histogram_path(channel))

	@staticmethod
	def get_pull_plot(id):

		"""
		Returns a workspace's pull plot.

		Parameters:
			id (string): The workspace id
		Returns:
			object: A pull plot.
		"""

		# return binary file contents
		return send_file(Workspace(id).pull_plot_path())

	@staticmethod
	def get_fit(id, patches):

		"""
		Returns a workspace's fit parameters.

		Parameters:
			id (string): The workspace id
		Returns:
			object: A list of the fit's parameters.
		"""

		# get workspace fit
		fit = Workspace(id).get_fit(patches)

		# check for return value
		return fit if fit else Response('No fit.', status=404)
