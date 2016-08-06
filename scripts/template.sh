#!/usr/bin/env bash -l

OUTPUT='template'
INPUT='src'

mkdir -p $OUTPUT/{blocks,collections}

rm -rf $OUTPUT/blocks/*.block
rm -rf $OUTPUT/collections/*.{conf,list}
rm -rf $OUTPUT/*.{conf,region}

cp $INPUT/blocks/*.block $OUTPUT/blocks/
cp $INPUT/collections/*.{conf,list} $OUTPUT/collections/
cp $INPUT/*.{conf,region} $OUTPUT/

echo '> Built template files'