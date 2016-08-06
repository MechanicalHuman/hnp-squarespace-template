#!/usr/bin/env bash -l

OUTPUT='template/assets'
INPUT='src/assets'

rm -rf $OUTPUT
mkdir -p $OUTPUT
cp $INPUT/* $OUTPUT

echo '> Built assets'