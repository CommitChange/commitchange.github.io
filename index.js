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
import queryConsole from './lib/console'
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
      location.href = ''
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

  const selectedNavParent$ = flyd.map(x => x.parent, state.selectedLink$)

  state.openNavLinks$ = flyd.stream([selectedNavParent$()])

  state.consoleQuery$ = flyd.stream()

  state.consoleQueryResponse$ = flyd.merge(
    flyd.stream({})
  , flyd_flatMap(getConsoleQuery(state), state.consoleQuery$))

  state.clickShowMenu$ = flyd.stream()

  state.showMenu$ = flyd.merge(
      flyd.map(() => false, state.selectedLink$)
    , state.clickShowMenu$)

  // cache to localStorage
  flyd.map(
    r => localStorage.setItem('resources$', JSON.stringify(r))
  , state.resources$ 
  )

  state.openConsole$ = flyd.stream()

  state.consoleResultType$ = flyd.stream('JSON')

  state.loading$ = flyd_mergeAll([
      flyd.map(x => true, state.consoleQuery$)
    , flyd.map(x => false, state.consoleQueryResponse$)
  ])

  window.state = state

  return state
}


const getConsoleQuery = state => ev => {
  if(state.loading$()) return
  ev.preventDefault()
  const path = '/' + ev.target.querySelector('input').value.trim()
  const url = "https://api.commitchange.com"
  return request({method: 'get', url, path}).load 
}

function view(state) {
  return h('div.relative', [
    nav(state)
  , details(state)
  , queryConsole(state)
  , h('button.console-button.sh-1.z-2.tooltip--left', {
        on: {click: [state.openConsole$, !state.openConsole$()]}
      , attrs: {'data-tooltip': `${state.openConsole$() ? 'Close' : 'Open'} console`}
      }
    , [h('i.material-icons', state.openConsole$() ? 'keyboard_arrow_right' : 'keyboard_arrow_left')]
    )
  , state.loading$() ? h('div.loader') : ''
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

