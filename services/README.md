# Running this Application

To run this application:

1. Copy config.template.py to config.py.
2. Fill in the indicated fields in config.py with your desired values.
3. Run: python3 app.py

## Configuration

The file config.py contains the following values:
```
# system configuration
UPLOAD_FOLDER = 'public/workspaces'
APP_JQ = '/opt/homebrew/bin/jq'
DEBUG = True
HOST = 'localhost'
PORT = '5000'

# mail configuration - used only for contact form
MAIL_SERVER = '<Your mail host here>'
MAIL_PORT = 587
MAIL_USERNAME = '<Your mail username here>'
MAIL_PASSWORD = '<Your mail password here>'
MAIL_USE_TLS = True
MAIL_USE_SSL = False
MAIL_SENDER = '<Your mail sender email address here>'
```
## Configuration Values

The following is a description of the values contained in config.py:

### UPLOAD_FOLDER

This is where the user workspaces are uploaded to.  By default, it is set to the folder (local to this application):
```
/public/workspaces
```

You can optionally change this to be somewhere else if you'd like.

### APP_JQ

This is the path to the jq utility app.  On MacOS, it is located in
```
/opt/homebrew/bin/jq
```
If you are running on another operating system, then you will need to set this accordingly.  On most linux systems, this path should be set to 'user/bin'.

### DEBUG

This is the debugging state for Flask and determines how error messages are displayed.  If you are running locally, then you can set this to True for detailed error messages.  When you deploy to production, then you should set this to False.

### HOST

This is the host that the server runs on.  For local development, this is set to "localhost".  When you deploy to another server, then you should set this to that server's hostname or IP address.

### PORT

This is the port that the server runs on.  It is set to 5000 by default but if you are running the application on a public web server then you will want to change this to 80 for HTTP or 443 for HTTPS.  Note: To run on port 80 or 443, you will need to have root access priveleges.