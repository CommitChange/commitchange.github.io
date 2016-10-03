import R from 'ramda'
import h from 'snabbdom/h'

module.exports =  state =>
  h('nav.pt2', [
      h('h1.h2.m0.p2', 'CommitChange')
    , h('hr.mt0')
    , h('div.pX2.pb2.mono', R.map(navSub(state), R.toPairs(state.resources$())))
    , h('hr.mt0')
    , h('a.p2', {on: {click: state.refreshOptions$}, props: {href: '#'}}, 'Refresh docs')
    ]
  )

const navSub = state => ([name, subOption]) => {
  const subLinks = R.map(navLink(state, name), state.navLinks$()[name])
  return h('ul.m0.list-reset', [
    h('li', name)
  , h('ul.mt0.list-reset.pl2', subLinks)
  ])
}

const navLink = (state, name) => link => {
  const txt = `${link.meth}:${name}:${link.path}`
  return h('li', {
    class: {active: state.selectedLink$() === link}
  }, [
    h('a', {on: {click: [state.selectedLink$, link]}, props: {href: `#${txt}`}}, link.meth + ' ' + link.path)
  ])
}

