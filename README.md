## Getting started
- all developing should happen on the `dev` branch so the first step is to `git checkout -b dev origin/dev`
- `npm install`
- `npm run postcss` (builds and watches css) 
- `npm run budo` (runs livereload)

## Publishing
- from the `dev` branch run `npm run build`
- then `cd` into the `dist` directory
- if this is your first time publishing, you'll have to `git init`,  `git remote add origin https://github.com/CommitChange/commitchange.github.io.git`
- once inside of `dist` directory you can `git add --all`, `git commit -m 'Build'` and `git push origin master`
- updates pushed from the `master` branch should be viewable at [`http://docs.commitchange.com`](http://docs.commitchange.com)
