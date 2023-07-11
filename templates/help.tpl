<h1><i class="fa fa-info-circle"></i>Help</h1>

<div class="content">
	<p>This is a brief guide on how to use the <%= defaults.application.name %> application. </p>

	<ol>
		<li>
			<h2>Select your main workspace JSON file</h2>
			<p>The first step in using the <%= defaults.application.name %> is to upload your workspace description file. Workspace files are <a href="https://iris-hep.org/projects/pyhf.html" target="_blank">pyhf</a> formatted .JSON files. </p>

			<div class="figure">
				<img src="images/help/select-workspace.png" width="450px" />
				<div class="caption">Select Workspace</div>
			</div>
		</li>

		<li>
			<h2>Select a patchset JSON file</h2>
			<p>Some workspaces also include an accompaning patchset JSON file. The patchset file can be optionally uploaded along with the workspace. Not all workspace files require a patchset. </p>

			<div class="figure">
				<img src="images/help/select-patchset.png" width="450px" />
				<div class="caption">Select Patchsset</div>
			</div>
		</li>

		<li>
			<h2>Upload your workspace</h2>
			<p>Once you have selected a workspace and patchset, click the "Upload" button to upload your workspace files.  </p>

			<div class="figure">
				<img src="images/help/upload.png" width="450px" />
				<div class="caption">Upload</div>
			</div>
		</li>

		<li>
			<h2>View workspace</h2>
			<p>Once you have have uploaded your workspace files, you will be presented with the main view of the application which shows a histogram in the main panel and a set of sidebars on the left. </p>

			<div class="figure">
				<a href="images/help/workspace-view.png" target="_blank" class="lightbox" title="View Workspace"><img src="images/help/workspace-view.png" /></a>
				<div class="caption">View Workspace</div>
			</div>
		</li>

		<li>
			<h2>Select a patch</h2>
			<p>If your model includes a patchset, then a "Patches" sidebar panel will be shown that allows you to select a patchset to apply. A description of the patchset will also be displayed, if it is provided. </p>

			<div class="figure">
				<a href="images/help/patches.png" target="_blank" class="lightbox" title="Patches"><img src="images/help/patches.png" width="400" /></a>
				<div class="caption">Patches</div>
			</div>
		</li>

		<li>
			<h2>Select a channel</h2>
			<p>If your model includes more than one channel, then you may select the particular channel that you wish to display. </p>

			<div class="figure">
				<a href="images/help/channels.png" target="_blank" class="lightbox" title="Channels"><img src="images/help/channels.png" width="400" /></a>
				<div class="caption">Channels</div>
			</div>
		</li>

		<li>
			<h2>Change model parameters</h2>
			<p>If your workspace models includes a set of parameters, then a "Parameters" sidebar panel will be shown where you can change parameter values using a set of sliders. </p>

			<div class="figure">
				<a href="images/help/parameters.png" target="_blank" class="lightbox" title="Parameters"><img src="images/help/parameters.png" width="400" /></a>
				<div class="caption">Parameters</div>
			</div>

			<div class="figure">
				<a href="images/help/parameters/parameters.gif" target="_blank" class="lightbox" title="Parameters"><img src="images/help/parameters/parameters.gif" /></a>
				<div class="caption">Changing Parameters</div>
			</div>

			<h3>Parameter Impact</h3>
			<p>Each model parameter has an "impact" value which is an estimate of the amount of impact that each parameter has on the model.  The level of impact is depicted in the little meter at the top right of each parameter.  You can sort the parameters by impact in order to more easily focus upon the most important ones. </p>

			<div class="figure">
				<a href="images/help/impact.png" target="_blank" class="lightbox" title="Impact"><img src="images/help/impact.png" width="400" /></a>
				<div class="caption">Impact</div>
			</div>

			<h3>Parameter Locking</h3>
			<p>Each model parameter also has a lock attribute which allows you to lock the value of that parameter.  This lock will prevent the value from being changed manually by using the slider or entering a value and will also prevent the value from being changed when you perform a fit (described below). </p>

			<div class="figure">
				<a href="images/help/unlocked.png" target="_blank" class="lightbox" title="An Unlocked Parameter"><img src="images/help/unlocked.png" width="400" /></a>
				<div class="caption">An Unlocked Parameter</div>
			</div>
			<div class="figure">
				<a href="images/help/locked.png" target="_blank" class="lightbox" title="A Locked Parameter"><img src="images/help/locked.png" width="400" /></a>
				<div class="caption">A Locked Parameter</div>
			</div>
		</li>

		<li>
			<h2>Perform a fit</h2>
			<p>On the top toolbar, you'll see a "Perform Fit" button.  Click this button.  You'll notice that the parameters are adjusted in such a way that the difference between the model and the observed values is minimized. </p>

			<div class="figure">
				<a href="images/help/fit/fit.gif" target="_blank" class="lightbox" title="Peforming a Fit"><img src="images/help/fit/fit.gif" /></a>
				<div class="caption">Performing a Fit</div>
			</div>
		</li>

		<li>
			<h2>Download a plot</h2>
			<p>Click the "Download Plot" button on the toolbar to download the current plot as a PDF file.  This make it easy to store or share plots with others. </p>
		</li>

		<li>
			<h2>Upload Another Workspace</h2>
			<p>Click the "New Workspace" button on toolbar to upload and analyze another workspace. </p>
		</li>
	</ol>
</div>