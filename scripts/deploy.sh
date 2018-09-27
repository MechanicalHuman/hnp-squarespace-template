#!/usr/bin/env bash -l

MESSAGE=$(git log -1 --pretty=%B)

cd ./template
git add .
git commit -m "$MESSAGE"
git push

echo '> Template Deployed to '$npm_package_config_squarespace_url
