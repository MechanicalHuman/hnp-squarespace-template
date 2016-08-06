#!/usr/bin/env bash -l

launch_squarespace(){
    squarespace-server $npm_package_config_squarespace_url --port=$npm_package_config_server_port --template-directory=./template/ #--run-authenticated
}


launch_squarespace_auth(){
    squarespace-server $npm_package_config_squarespace_url --port=$npm_package_config_server_port --template-directory=./template/ --run-authenticated
}

if [ "$npm_package_config_squarespace_auth" = true ]; then
   launch_squarespace_auth
else
   launch_squarespace
fi
