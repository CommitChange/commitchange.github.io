#!/bin/bash

echo "creating dist folder if it does not exist"
mkdir -p dist
echo "copying index.html into dist/index.html..."
cp index.html dist/index.html
echo "building css into dist/build.css"
postcss -c postcss.js -l && cp build.css dist/build.css
echo "browserifying js into dist/index.js..."
browserify -t babelify index.js | uglifyjs > dist/index.js
echo "copying markdown into dist/markdown"
cp -R markdown dist/markdown 
echo "done. now cd into dist, git add, git commit and push built files"    

