<h1><i class="fa fa-info-circle"></i>About <%= defaults.application.name %></h1>

<div class="content">
	<p><%= defaults.application.name %> is a web based utility that allows particle physicists to easily and conveniently view results of <a href="https://iris-hep.org/projects/pyhf.html" target="_blank">pyhf</a> models and inferences. </p>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Display histograms.</li>
					<li>Display pull plots.</li>
					<li>Display and interact with model parameters</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Easy to use workspace visualization.</li>
					<li>No software installation required.</li>
					<li>Runs on any internet connected device.</li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>

	<div class="figure">
		<a href="images/help/fit/fit.gif" target="_blank" class="smooth lightbox" title="<%= defaults.application.name %>"><img src="images/help/fit/fit.gif" /></a>
		<div class="caption"><%= defaults.application.name %> Performing a Fit</div>
	</div>

	<div class="figure row">
		<div class="figure">
			<img src="images/info/iphone-workspace.png" style="border:none; width:300px" />
			<div class="caption"><%= defaults.application.name %> Mobile</div>
		</div>
	</div>
</div>