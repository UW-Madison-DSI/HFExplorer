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

# set file upload path
#
logging.basicConfig(filename='log/info.log', level=logging.INFO)

# create new Flask app
#
app = Flask(__name__, static_folder='../', static_url_path="/")
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'public/workspaces')
app.config['APP_JQ'] = '/opt/homebrew/bin/jq'

################################################################################
#                              utility methods                                 #
################################################################################

def get_array(name):
	array = []
	value = request.form.get('patches')
	if not value:
		return []
	terms = value.split('_')
	for term in terms:
		array.append(int(term) if term.isnumeric() else term)
	return array

def get_query_array(name):
	array = []
	value = request.args.get('patches')
	if not value:
		return []
	terms = value.split('_')
	for term in terms:
		array.append(int(term) if term.isnumeric() else term)
	return array

def get_dict(name):
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
	return app.send_static_file("index.html")

################################################################################
#                              workspace routes                                #
################################################################################

# upload a new workspace
#
@app.post('/api/workspaces/upload')
def post_upload():
	return WorkspaceController.post_upload()

# get workspace patches
#
@app.get('/api/workspaces/<string:id>/patches')
def get_patches(id):
	return WorkspaceController.get_patches(id)

# get workspace parameters
#
@app.get('/api/workspaces/<string:id>/params')
def get_params(id):
	patches = get_query_array('patches')
	return WorkspaceController.get_params(id, patches)

# get workspace channels
#
@app.get('/api/workspaces/<string:id>/channels')
def get_channels(id, patches=None):
	patches = get_array('patches')
	return WorkspaceController.get_channels(id, patches)

# get a workspace histogram
#
@app.get('/api/workspaces/<string:id>/histograms/<string:channel>')
def get_histogram(id, channel):
	return WorkspaceController.get_histogram(id, channel)

# get a workspace pull plot
#
@app.get('/api/workspaces/<string:id>/pull-plot')
def get_pull_plot(id):
	return WorkspaceController.get_pull_plot(id)

# get a workspace's fit parameters
#
@app.get('/api/workspaces/<string:id>/fit')
def get_fit(id):
	patches = get_query_array('patches')
	return WorkspaceController.get_fit(id, patches)

################################################################################
#                              plotting routes                                 #
################################################################################

# create a set of histograms
#
@app.post('/api/workspaces/<string:id>/histograms')
def post_histograms(id):
	patches = get_array('patches')
	params = get_dict('params')
	return WorkspaceController.post_histograms(id, patches, params)

# create a pull plot
#
@app.post('/api/workspaces/<string:id>/pull-plot')
def post_pull_plot(id):
	patches = get_array('patches')
	params = get_dict('params')
	return WorkspaceController.post_pull_plot(id, patches, params)

################################################################################
#                              plotting routes                                 #
################################################################################

# submit a contact form request
#
@app.post('/api/contacts')
def post_create(id):
	return ContactController.post_create()

################################################################################
#                                     main                                     #
################################################################################

if __name__ == '__main__':
	app.run()
