#!/usr/bin/env bash -l

INPUT='src'
OPTIONS='--ignoreDotFiles --ignoreUnreadable --interval=0.1'

watch 'npm run build:assets -s' $INPUT/assets $OPTIONS &
watch 'npm run build:template -s' $INPUT $OPTIONS --filter='scripts/watch-filter.js'