#!/usr/bin/env bash -l

PORT=$npm_package_config_reload_port
PROXY_SERVER=localhost:$npm_package_config_server_port
UI_PORT=$npm_package_config_reload_ui_port

tabname $npm_lifecycle_event

browser-sync start --proxy=$PROXY_SERVER --port=$PORT --ui-port=$UI_PORT --no-notify --config ./scripts/reload-config.js



