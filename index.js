import R from 'ramda'
import flyd from 'flyd'
import url from 'url'
import h from 'snabbdom/h'
import snabbdom from 'snabbdom'
import render from 'ff-core/render'
import request from 'flyd-ajax'
import flyd_flatMap from 'flyd/module/flatmap'
import flyd_mergeAll from 'flyd/module/mergeall'
import parseJSON from './lib/parse-json'
import getApiData from './lib/get-api-data'
import getNavLinks from './lib/get-nav-links'
import nav from './lib/nav'
import details from './lib/details'
import sortObjByKey from './lib/sort-obj-by-key'

function init() {
  let state = {
    refreshOptions$: flyd.stream()
  , selectedLink$: flyd.stream()
  }

  state.introMD$ = flyd.map(r => r.response, request({method: 'get' , path: 'markdown/intro.md' }).load)

  // Clear cache and reload page
  flyd.map(
    ev => {
      localStorage.removeItem('resources$')
      location.reload()
    }
  , state.refreshOptions$)

  // Load resource data from either localStorage cache or from Ajax requests
  const cachedRes = parseJSON(localStorage.getItem('resources$'))

  const unsortedResources$ = cachedRes ? flyd.stream(cachedRes) : getApiData()


  // sorts the resource names alphabetically 
  state.resources$ = flyd.map(sortObjByKey, unsortedResources$)

  // Load the hash on page load, with method/parent/pathname, and load up the selected resource into the state
  const initialLinks = getNavLinks(state.resources$())

  if(url.parse(location.href).hash) {
    let [initAction, initParent, initPath] = url.parse(location.href).hash.replace('#', '').split(':')
    let justLinkObjs = R.flatten(R.values(initialLinks)) // unnest all the links to find the current one
    let link = R.find(ln => ln.parent === initParent && ln.meth === initAction && ln.path === initPath, justLinkObjs)
    state.selectedLink$(link)
  } else {
    state.selectedLink$(false)
  }

  state.navLinks$ = flyd.merge(
    flyd.stream(initialLinks)
  , flyd.map(getNavLinks, state.resources$) 
  )

  state.clickHideMenu$ = flyd.stream()

  state.hideMenu$ = flyd.merge(state.selectedLink$, state.clickHideMenu$)

  // cache to localStorage
  flyd.map(
    r => localStorage.setItem('resources$', JSON.stringify(r))
  , state.resources$ 
  )

  return state
}

function view(state) {
  return h('div.container.relative.p-2.sm-p-1', [
    nav(state)
  , details(state)
  ])
}

const patch = snabbdom.init([
  require('snabbdom/modules/eventlisteners')
, require('snabbdom/modules/props')
, require('snabbdom/modules/attributes')
, require('snabbdom/modules/style')
, require('snabbdom/modules/class')
])

let container = document.getElementById('container')

render({view, state: init(), patch, container})

