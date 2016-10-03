## Getting started
- `npm install`
- `npm install budo -g` ([budo](https://www.npmjs.com/package/budo) is used for livereload)
- `npm run watch-css` (runs [postcss](https://github.com/postcss/postcss))
- `npm run watch-js` (runs budo, babelify and should open browser to `http://172.16.21.29:9966`)

## Publishing
- this repo `gitignore`s the directory containing the build files (`dist`), so initially you have to clone it: `git clone https://github.com/CommitChange/commitchange.github.io.git dist`
- after you've cloned the `commitchange.github.io` repo into the `dist` directory, run `npm run prepublish`, which will run the build scripts and place the built files into `dist`
- next you can `cd` into the `dist` directory and `git add --all`, `git commit` and `git push origin master`
- updates pushed to the `commitchange.github.io` repo should be viewable at [`http://docs.commitchange.com`](http://docs.commitchange.com)

