################################################################################
#                                                                              #
#                                    app.py                                    #
#                                                                              #
################################################################################
#                                                                              #
#        This is a simple web server for the HF Explorer application.          #
#                                                                              #
#        Author(s): Abe Megahed                                                #
#                                                                              #
################################################################################
#     Copyright (C) 2023, Data Science Institute, University of Wisconsin      #
################################################################################

import os
from flask import Flask, request, jsonify
from models.workspace import Workspace
from controllers.workspace_controller import WorkspaceController
from controllers.contact_controller import ContactController
import logging

# set logging file
#
# logging.basicConfig(filename='log/info.log', level=logging.INFO)

# create new Flask app
#
app = Flask(__name__, static_folder='../', static_url_path="/")
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'public/workspaces')
app.config['APP_JQ'] = '/opt/homebrew/bin/jq'

################################################################################
#                    request parameter parsing methods                         #
################################################################################

def get_array(name):

	"""
	Get a set of form (body) parameters that are passed as an array.

	Parameters:
		name: The parameter name
	Return
		array: The set of array values
	"""

	array = []
	value = request.form.get(name)
	if not value:
		return []
	terms = value.split('_')
	for term in terms:
		array.append(int(term) if term.isnumeric() else term)
	return array

def get_query_array(name):

	"""
	Get a set of query string parameters that are passed as an underscore separated string.

	Parameters:
		name: The parameter name
	Return
		array: The set of array values
	"""
	array = []
	value = request.args.get(name)
	if not value:
		return []
	terms = value.split('_')
	for term in terms:
		array.append(int(term) if term.isnumeric() else term)
	return array

def get_dict(name):

	"""
	Get a set form (body) parameters that are passed as key / value pairs.

	Parameters:
		name: The parameter name
	Return
		array: The set of array values
	"""

	array = {}
	dict = request.form.to_dict(flat=True)
	for key in dict:
		if (key.startswith(name)):
			value = dict[key]
			key = key.replace(name, '').replace('[', '').replace(']', '')
			array[key] = float(value) if value.isnumeric() else value
	return array

################################################################################
#                            API route definitions                             #
################################################################################

# root route
#
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):

	"""
	Handles requests for the static web content (the UI).

	Return
		response: The web content requested
	"""

	return app.send_static_file("index.html")

################################################################################
#                              workspace routes                                #
################################################################################

@app.post('/api/workspaces/upload')
def post_upload():

	"""
	Upload a set of workspace files.

	Return
		object: The newly created workspace
	"""

	return WorkspaceController.post_upload()

@app.get('/api/workspaces/<string:id>/patches')
def get_patches(id):

	"""
	Get a workspace's list of patches.

	Parameters
		id: The workspace id
	Return
		array: The list of patch values
	"""

	return WorkspaceController.get_patches(id)

# get workspace parameters
#
@app.get('/api/workspaces/<string:id>/params')
def get_params(id):

	"""
	Get a workspace's parameter information.

	Parameters
		id: The workspace id
	Return
		object: An object containing metadata about the parameters
	"""

	patches = get_query_array('patches')
	return WorkspaceController.get_params(id, patches)

@app.get('/api/workspaces/<string:id>/channels')
def get_channels(id, patches=None):

	"""
	Get a workspace's channels.

	Parameters
		id: The workspace id
		patches: The patches to apply to the workspace
	Return
		string[]: A list of channel names
	"""

	patches = get_array('patches')
	return WorkspaceController.get_channels(id, patches)

@app.get('/api/workspaces/<string:id>/histograms/<string:channel>')
def get_histogram(id, channel):

	"""
	Get a workspace histogram for a particular channel.

	Parameters
		id: The workspace id
		channel: The name of the channel
	Return
		pdf: A pdf file containing the plot
	"""

	return WorkspaceController.get_histogram(id, channel)

@app.get('/api/workspaces/<string:id>/pull-plot')
def get_pull_plot(id):

	"""
	Get a workspace pull plot.

	Parameters
		id: The workspace id
	Return
		pdf: A pdf file containing the plot
	"""

	return WorkspaceController.get_pull_plot(id)

@app.get('/api/workspaces/<string:id>/fit')
def get_fit(id):

	"""
	Get a list of fit parameters.

	Parameters
		id: The workspace id
		patches: The patches to apply
	Return
		array: A list of the parameter values
	"""

	patches = get_query_array('patches')
	return WorkspaceController.get_fit(id, patches)

################################################################################
#                              plotting routes                                 #
################################################################################

# create a set of histograms
#
@app.post('/api/workspaces/<string:id>/histograms')
def post_histograms(id):

	"""
	Create a set of histograms.

	Parameters
		id: The workspace id
	Return
		array: A list of the histograms that were created
	"""

	patches = get_array('patches')
	params = get_dict('params')
	return WorkspaceController.post_histograms(id, patches, params)

@app.post('/api/workspaces/<string:id>/pull-plot')
def post_pull_plot(id):

	"""
	Create a pull plot.

	Parameters
		id: The workspace id
	Return
		string: The name of the pull plot
	"""

	patches = get_array('patches')
	params = get_dict('params')
	return WorkspaceController.post_pull_plot(id, patches, params)

################################################################################
#                              plotting routes                                 #
################################################################################

# submit a contact form request
#
@app.post('/api/contacts')
def post_create():

	"""
	Submit a contact email request.

	Return
		response: The status of the request
	"""

	return ContactController.post_create()

################################################################################
#                                     main                                     #
################################################################################

if __name__ == '__main__':
	app.run()
