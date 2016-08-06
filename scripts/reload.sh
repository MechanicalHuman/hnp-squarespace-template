#!/usr/bin/env bash -l

FILES='template'
DEBOUNCE='500'
PORT=$npm_package_config_reload_port
PROXY_SERVER=localhost:$npm_package_config_server_port
UI_PORT=$npm_package_config_reload_ui_port

# --reload-debounce $DEBOUNCE


browser-sync start --proxy=$PROXY_SERVER --port=$PORT --ui-port=$UI_PORT --files $FILES --plugins browser-sync-logger --no-open --no-inject-changes



