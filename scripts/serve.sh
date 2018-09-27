#!/usr/bin/env bash -l

USE_AUTH=$npm_package_config_squarespace_auth
URL=$npm_package_config_squarespace_url
PORT=$npm_package_config_server_port
TEMPLATE=./template/

if [ "$USE_AUTH" = true ]; then
	squarespace-server $URL --port=$PORT --directory=$TEMPLATE --auth
else
	squarespace-server $URL --port=$PORT --directory=$TEMPLATE
fi
