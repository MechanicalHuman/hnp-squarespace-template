#!/usr/bin/env bash -l

OUTPUT='template/styles'
INPUT='src/styles'

if [ "$1" = "--watch" ]; then
     watch 'npm run build:css -s' $INPUT --ignoreDotFiles --ignoreUnreadable --interval='0.1'
else
    rm -rf $OUTPUT
    mkdir -p $OUTPUT/legacy
    cp $INPUT/includes/*.{css,less} $OUTPUT/
    cp $INPUT/legacy/*.less $OUTPUT/legacy/
    lessc --autoprefix='> 5%' $INPUT/main.less $OUTPUT/main.css
    echo '> Built style sheets'
fi


