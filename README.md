## Getting started
- all developing should happen on the `dev` branch so the first step is to `git checkout -b dev origin/dev`
- `npm install`
- `npm install budo -g` ([budo](https://www.npmjs.com/package/budo) is used for livereload)
- `npm run watch-css` (runs [postcss](https://github.com/postcss/postcss))
- `npm run watch-js` (runs budo, babelify and should open browser to `http://172.16.21.29:9966`)

## Publishing
- from the `dev` branch run `npm run prepublish`
- then `cd` into the `dist` directory
- if this is your first time publishing, you'll have to `git init`,  `git remote add origin https://github.com/CommitChange/commitchange.github.io.git`
- once inside of `dist` directory you can `git add --all`, `git commit` and `git push origin master`
- updates pushed from the `master` branch should be viewable at [`http://docs.commitchange.com`](http://docs.commitchange.com)
