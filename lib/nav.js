import R from 'ramda'
import h from 'snabbdom/h'

module.exports =  state =>
  h('nav', {class: {hideNav: state.hideMenu$()}}, [
      h('header', [
        h('div.menu', [
          h('span',{
            props: {innerHTML: '&#9776;'}
          , on: {click: _ => state.clickHideMenu$(false)}
          })
        , h('span',
            {props: {innerHTML: '&times;'}
          , on: {click: _ => state.clickHideMenu$(true)}
          })
        ])
      , h('a', {props: {href: '/'}}, [h('img.pr3.pb1', {props: {src: 'cc-logo.png'}})])
      , h('hr.mt0')
      ])
    , h('section', [
        h('div.pX2.pb2.mono', R.map(navSub(state), R.toPairs(state.resources$())))
      , h('hr.mt0')
      , h('a.p2', {on: {click: state.refreshOptions$}, props: {href: '#'}}, 'Refresh docs')
      ])
    ]
  )

const navSub = state => ([name, subOption]) => {
  const subLinks = R.map(navLink(state, name), state.navLinks$()[name])
  return h('ul.m0.list-reset.small', [
    h('li.ellipsis', name)
  , h('ul.mt0.list-reset.pl2', subLinks)
  ])
}

const navLink = (state, name) => link => {
  const txt = `${link.meth}:${name}:${link.path}`
  return h('li.ellipsis', {
    class: {active: state.selectedLink$() === link}
  }, [
    h('a', {on: {click: [state.selectedLink$, link]}, props: {href: `#${txt}`}}, link.meth + ' ' + link.path)
  ])
}

