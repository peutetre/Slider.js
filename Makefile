SLIDER = slider
DIST = dist
VERSION = 0.1
FILES = slider.js

all: cat
	@@java -jar vendor/compiler.jar --js ${DIST}/${SLIDER}-${VERSION}.js --js_output_file ${DIST}/${SLIDER}-${VERSION}.min.js

cat:
	@@cat ${FILES} > ${DIST}/${SLIDER}-${VERSION}.js;

clean:
	@@rm ${DIST}/${SLIDER}-${VERSION}.js ${DIST}/${SLIDER}-${VERSION}.min.js
