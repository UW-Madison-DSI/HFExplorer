<p align="center">
	<div align="center">
		<img src="./images/logos/hf-logo.svg" alt="Logo" style="width:33%">
	</div>
</p>

# HF Explorer

HF Explorer is a web based viewer for high energy particle physics that allows users to view various types of plots from data formatted as HistFactory workspaces.

If you are working with HistFactory formatted data, HF Explorer provides an easy-to-use and convenient way to generate plots, perform fits, and to investigate the impact of various parameters on the model performance.

<div align="center">
    <img src="./images/info/workspace.png" style="width:75%; border:2px solid lightgrey" />
    <div><i>HF Explorer</i></div>
</div>

## Installation

This application depends upon the following utilities which will need to be installed before you can run it:

- [Flask](https://flask.palletsprojects.com/en/2.3.x/installation/)

Flask is a Python framework that is used for the back end web services.

```
pip install Flask

```

- [pyhf](https://scikit-hep.org/pyhf/installation.html):

pyhf is a Python utility that is used to read and manage HistFactory data in JSON format.

```
python -m pip install pyhf
```

- [cabinetry](https://pypi.org/project/cabinetry/):

Cabinetry is a Python utility that is used to perform parameter fits.

```
python -m pip install cabinetry
```

- [jq](https://jqlang.github.io/jq/download/):

Jq is a command line utility for managing JSON patch files.

```
brew install jq
```

## Configuration

The application configuration is managed by the file: services/config.py.  To configure the application for the first time:

1. cd services
2. Copy config.template.py to config.py.
3. Fill in the indicated fields in config.py with your desired values (optional).

For more information about configuration, see [services/README.md](services/README.md)

## Running

After you have configured the server, you can start it with the following command:

```
python3 app.py
```

After starting the server, to run the application, open your web browser to:

```
http://localhost:5000
```

## Documentation

View the [Help](http://www.hepexplorer.net/#help) page for details of how to use the application.

<!-- LICENSE -->
## License

Distributed under the permissive MIT license. See the [license](./LICENSE.txt) for more information.

<!-- Acknowledgements -->
## Acknowledgements

This software was created by the [American Family Insurance Data Science Institute](https://datascience.wisc.edu/) at the [University of Wisconsin-Madison](https://www.wisc.edu/) under a grant from [IRIS Hep](https://iris-hep.org/)