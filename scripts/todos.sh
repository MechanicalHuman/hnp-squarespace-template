#!/usr/bin/env bash -l

EXTENSIONS='.*\.(js|sh|scss|css|less|html|jade|region|block)'
FILTER='.*(node_modules|\.git|template).*'
INPUT=$(find -E . -type f -iregex $EXTENSIONS -not \( -iregex $FILTER \) -print)
OUTPUT='TODO.md'
OPTIONS='--skip-unsupported --associate-parser=.region,twigParser --associate-parser=.block,twigParser'

tabname $npm_lifecycle_event

buildTodos() {
    leasot --reporter markdown $OPTIONS $INPUT > $OUTPUT
}

printTodos() {
    leasot --reporter table $OPTIONS $INPUT
}



if [ "$1" = "--print" ]; then
    printTodos
elif [ "$1" = "--watch" ]; then
    watch 'npm run todos -s -- --print' src --ignoreDotFiles --ignoreUnreadable
else
    buildTodos
    printTodos
    echo '> TODOS'
fi


exit 0