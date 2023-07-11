<p align="center">
	<div align="center">
		<img src="./images/logos/hf-logo.svg" alt="Logo" style="width:33%">
	</div>
</p>

# HF Explorer

HF Explorer is a web based viewer for particle physics that allows users to view various types of plots from data formatted as HistFactory workspaces.

<div align="center">
    <img src="./images/info/workspace.png" style="width:75%; border:2px solid lightgrey" />
    <div><i>HF Explorer</i></div>
</div>

## Installation

To run the web application, install the project files in the document root of your web server and then edit the file "config/config.json" to point to the back end web server.   You will need to install and configure the back end web server before you can perform this step.
```
{
	"server": "http://localhost/hf-explorer-server/public/api"
}

```

## Documentation

View the [Help](http://www.hepexplorer.net/#help) page for details of how to use the application.

<!-- LICENSE -->
## License

Distributed under the permissive MIT license. See the [license](./LICENSE.txt) for more information.

<!-- Acknowledgements -->
## Acknowledgements

This software was created by the [American Family Insurance Data Science Institute](https://datascience.wisc.edu/) at the [University of Wisconsin-Madison](https://www.wisc.edu/) under a grant from [IRIS Hep](https://iris-hep.org/)