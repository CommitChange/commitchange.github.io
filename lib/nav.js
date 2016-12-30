import R from 'ramda'
import h from 'snabbdom/h'

module.exports =  state =>
  h('nav', {class: {showMenu: state.showMenu$()}}, [
      h('header', [
        h('a.menu', [
          h('i.material-icons.hamburger'
          , {on: {click: _ => state.clickShowMenu$(true)}}
          , 'menu'
          )
        , h('i.material-icons.close'
          , {on: {click: _ => state.clickShowMenu$(false)}}
          , 'close'
          )
        ])
      , h('a.title.bold.h4', {props: {href: '/'}}, 'CommitChange API') 
      , h('hr.mt-1')
      ])
    , h('section.pb-2', [
        h('div.pb-2.mono', R.map(navGroup(state), R.toPairs(state.resources$())))
      , h('hr.mt-0')
      , h('button.table', {on: {click: state.refreshOptions$}, props: {href: '#'}}
        , [
          h('i.material-icons.table-cell.align-middle', 'autorenew')
        , h('span.table-cell.align-middle.pl-1', 'Refresh Docs')
        ])
      ])
    ]
  )

const navGroup = state => ([name, subOption]) => {
  const subLinks = R.compose(
   R.map(navLink(state, name))
  )(state.navLinks$()[name])
    
  return h('ul.m-0.p-0.navLinkParent' , {class: {isOpen : openNavLink(state, name)}}
  , [
    h('li.table.mb-1.cursor-pointer', { on: {click: toggleNavLinks(state, name)} }
    , [
      h('span.table-cell.align-middle.opacity-05'
      , [h('i.material-icons.arrow', 'keyboard_arrow_right')]
      )
    , h('span.bold.table-cell.align-middle.line-height-1'
      , {class: {active: state.selectedLink$().parent === name}}
      , name.replace('/', ''))
    ])
  , h('ul.pl-3.small.mb-2.navLinkSub', subLinks)
  ])
}

const openNavLink = (state, name) => R.contains(name, state.openNavLinks$())

const toggleNavLinks = (state, name) => () => {
  let isOpen = openNavLink(state, name) 
  if (isOpen) {
    state.openNavLinks$(R.filter(x => x != name, state.openNavLinks$()))
  } else {
    state.openNavLinks$(R.concat(state.openNavLinks$(), [name]))
  }
}


const navLink = (state, name) => link => {
  const txt = `${link.meth}:${name}:${link.path}`
  return h('li.ellipsis.line-height-1.mb-1', {
  }, [
    h('a', {
      class: {active: state.selectedLink$() === link}
    , on: {click: [state.selectedLink$, link]}
    , props: {href: `#${txt}`}}, link.meth + ' ' + link.path)
  ])
}

