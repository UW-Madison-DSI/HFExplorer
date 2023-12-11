<div class="masthead">
	<div class="background"></div>
	<div class="full-size overlay"></div>

	<div class="splash">
		<div class="logo">
			<img src="<%= defaults.welcome.splash.image.src %>" style="<%= image_style %>" />
		</div>

		<div class="brand">
			<span class="first"><%= defaults.welcome.splash.name.first %></span>
			<span class="middle"><%= defaults.welcome.splash.name.middle %></span>
			<span class="last"><%= defaults.welcome.splash.name.last %></span>
		</div>

		<% if (defaults.welcome.tagline) { %>
		<div class="tagline">
			<%= defaults.welcome.tagline %>
		</div>
		<% } %>
	</div>
</div>

<div class="contents">
	<div class="section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa rotated flipped fa-chart-bar"></i>Data Analysis for HEP</h2>
				<p><%= defaults.application.name %> is a web based utility that allows particle physicists to easily and conveniently view results of <a href="https://iris-hep.org/projects/pyhf.html" target="_blank">pyhf</a> models and to perform fits. </p>

				<% if (defaults.welcome.workspaces) { %>
				<p>View an example workspace: </p>
				<div class="buttons">
					<% for (let i = 0; i < defaults.welcome.workspaces.length; i++) { %>
					<a href="#workspaces/<%= defaults.welcome.workspaces[i].id %>">
					<button class="btn<% if (i == 0) { %> btn-primary<% } %>"><%= defaults.welcome.workspaces[i].name %></button>
					</a>
					<% } %>
				</div>
				<% } %>
				<br />
			</div>
			<div class="col-sm-6">
				<div class="figure">
					<a href="<%= defaults.welcome.image %>" target="_blank" class="lightbox" title="<%= defaults.welcome.caption %>"><img src="<%= defaults.welcome.image %>" /></a>
					<div class="caption"><%= defaults.welcome.caption %></div>
				</div>
			</div>
		</div>
	</div>

	<div class="section">
		<h2><i class="fa fa-play"></i>Getting Started</h2>
		<p>To get started, just upload your <a href="https://iris-hep.org/projects/pyhf.html" target="_blank">pyhf</a> workspace JSON files. </p>

		<form class="form-horizontal">

			<ul class="nav nav-tabs" role="tablist">

				<li role="presentation" class="local-tab active">
					<a role="tab" data-toggle="tab" href=".local-panel">
						<i class="fa fa-file"></i>
						<label>Upload from Local Files</label>
					</a>
				</li>

				<li role="presentation" class="remote-tab">
					<a role="tab" data-toggle="tab" href=".remote-panel">
						<i class="fa fa-upload"></i>
						<label>Upload from Remote URL</label>
					</a>
				</li>
			</ul>

			<br />

			<div class="tab-content">

				<div role="tabpanel" class="local-panel tab-pane active">

					<div class="workspace form-group">
						<label class="control-label">&nbsp;</label>
						<div class="controls">
							<label>Step 1: Select Workspace</label>
							<div>First, select your main workspace .json file. </div>

							<button class="background btn btn-light" style="float:left; margin-right:10px">Select Workspace</button>

							<input type="file" id="background-file" class="form-control" style="display:none; width:50%" />
						</div>
					</div>

					<div class="additions form-group">
						<label class="control-label">&nbsp;</label>
						<div class="controls">
							<label>Step 2: Select Patchset (optional)</label>
							<div>Next, optionally select a patchset to merge. </div>

							<button class="patchset btn btn-light" style="float:left; margin-right:10px">Select Patchset</button>

							<button class="background2 btn btn-light" style="float:left; margin-right:10px; display:none">Select Workspace</button>

							<input type="file" id="patchset-file" class="form-control" style="float:left; margin-right:10px; display:none; width:50%" />

							<input type="file" id="background2-file" class="hidden form-control" style="float:left; margin-right:10px; display:none; width:50%" />

							<button class="clear btn btn-light" disabled>Clear</button>
						</div>
					</div>

					<div class="upload-files form-group">
						<label class="control-label">&nbsp;</label>
						<div class="controls">
							<label>Step 3: Upload</label>
							<div>Upload your files. </div>
							<button class="submit btn btn-primary" disabled>Upload</button>
						</div>
					</div>
				</div>

				<div role="tabpanel" class="remote-panel tab-pane">

					<div class="url form-group">
						<label class="control-label">&nbsp;</label>
						<div class="controls">
							<label>Step 1: Enter URL</label>
							<div>First, enter the URL to a JSON workspace.  Most often, these will be URLs from <a href="http://hepdata.net">www.hepdata.net</a>. This must be a URL to a pyhf workspace. </div>

							<label>Workspace URL</label>
							<input type="text" class="form-control" value="<%= defaults.welcome.workspace_url %>" />
						</div>
					</div>

					<div class="upload-url form-group">
						<label class="control-label">&nbsp;</label>
						<div class="controls">
							<label>Step 2: Upload</label>
							<div>Upload a workspace from this url. </div>
							<button class="submit btn btn-primary">Upload</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>