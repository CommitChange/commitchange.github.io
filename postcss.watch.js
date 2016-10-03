'use strict' 

module.exports = {
  use: ['postcss-import']
, 'local-plugins' : true
, 'postcss-import': {onimport: sources => global.watchcss(sources, this.from)}
, input: 'index.css'
, output: 'build.css'
}

