#!/usr/bin/env bash -l

OUTPUT='template'
OPTIONS='--ignoreDotFiles --ignoreUnreadable --interval=0.1'
INPUT='src'

if [ "$1" = "--watch" ]; then
	watch 'npm run build:template -s' $INPUT $OPTIONS --filter='scripts/watch-filter.js'
else
	mkdir -p $OUTPUT/{assets,blocks,collections,pages}

	rm -rf $OUTPUT/assets/*
	rm -rf $OUTPUT/blocks/*.block
	rm -rf $OUTPUT/collections/*.{conf,list,item}
	rm -rf $OUTPUT/pages/*.{conf,page}
	rm -rf $OUTPUT/*.{conf,region}

	cp $INPUT/assets/* $OUTPUT/assets/
	cp $INPUT/blocks/*.block $OUTPUT/blocks/
	cp $INPUT/collections/*.{conf,list,item} $OUTPUT/collections/
	cp $INPUT/pages/*.{conf,page} $OUTPUT/pages/
	cp $INPUT/*.{conf,region} $OUTPUT/
	echo '> Copied template files'
fi
