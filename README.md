## Getting started
- `npm install`
- `npm install budo -g` ([budo](https://www.npmjs.com/package/budo) is used for livereload)
- `npm run watch-css` (runs [postcss](https://github.com/postcss/postcss))
- `npm run watch-js` (runs budo, babelify and should open browser to `http://172.16.21.29:9966`)

## Publishing
- use the `dev` branch for making changes. the `master` branch only contains the built files
- from the `dev` branch run `npm run prepublish`
- next switch to the `master` branch and `git add --all`, `git commit` and `git push origin master`
- updates pushed from the `master` branch should be viewable at [`http://docs.commitchange.com`](http://docs.commitchange.com)
