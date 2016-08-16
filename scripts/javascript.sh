#!/usr/bin/env bash -l

OUTPUT='template/scripts'
INPUT='src/scripts'
ENTRY='main.js'
BABEL='-t [ babelify --presets [ es2015 ] ]'

if [ "$NODE_ENV" = 'production' ]; then
    OPTIONS=''
    echo "module.exports = 'production'" > $INPUT/env.js
else
    OPTIONS='--debug'
    echo "module.exports = 'development'" > $INPUT/env.js
fi

# clean the JS directory
rm -rf $OUTPUT/*
mkdir -p $OUTPUT

# copy the Squarespace core JS
cp $INPUT/sqs-core/*.{js,map} $OUTPUT

if [ "$1" = "--watch" ]; then
    echo '> Watching src/scripts'
    watchify $INPUT/$ENTRY $OPTIONS --outfile $OUTPUT/bundle.js $BABEL
else
    browserify $INPUT/$ENTRY $OPTIONS --outfile $OUTPUT/bundle.js $BABEL
    echo '> Built javascript'
fi





