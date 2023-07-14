################################################################################
#                                                                              #
#                                  config.py                                   #
#                                                                              #
################################################################################
#                                                                              #
#        This file contains your application configuration.                    #
#                                                                              #
#        Author(s): Abe Megahed                                                #
#                                                                              #
################################################################################
#     Copyright (C) 2023, Data Science Institute, University of Wisconsin      #
################################################################################

# system configuration
UPLOAD_FOLDER = 'public/workspaces'
APP_JQ = '/opt/homebrew/bin/jq'
DEBUG = True
HOST = 'localhost'
PORT = '5000'

# mail configuration
MAIL_SERVER = '<Your mail host here>'
MAIL_PORT = 587
MAIL_USERNAME = '<Your mail username here>'
MAIL_PASSWORD = '<Your mail password here>'
MAIL_USE_TLS = True
MAIL_USE_SSL = False
MAIL_SENDER = '<Your mail sender email address here>'