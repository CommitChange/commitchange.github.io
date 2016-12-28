import R from 'ramda'
import h from 'snabbdom/h'

module.exports =  state =>
  h('nav', {class: {showMenu: state.showMenu$()}}, [
      h('header', [
        h('div.menu', [
          h('span',{
            props: {innerHTML: '&#9776;'}
          , on: {click: _ => state.clickShowMenu$(true)}
          })
        , h('span',
            {props: {innerHTML: '&times;'}
          , on: {click: _ => state.clickShowMenu$(false)}
          })
        ])
      , h('a.title.bold.h4', {props: {href: '/'}}, 'CommitChange API') 
      , h('hr.mt-1')
      ])
    , h('section', [
        h('div.pb-2.mono', R.map(navGroup(state), R.toPairs(state.resources$())))
      , h('hr.mt-0')
      , h('a.ml-1', {on: {click: state.refreshOptions$}, props: {href: '#'}}, 'Refresh docs')
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
      h('span.table-cell.align-middle.caret.opacity-05.pr-1'
      , [h('span.arrow', {props: {innerHTML: '&#9662;'}})]
      )
    , h('span.bold.table-cell.align-middle.px-1'
      , {class: {active: state.selectedLink$().parent === name}}
      , name.replace('/', ''))
    ])
  , h('ul.small.mb-2.navLinkSub', subLinks)
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
  return h('li.ellipsis', {
  }, [
    h('a.p-1', {
      class: {active: state.selectedLink$() === link}
    , on: {click: [state.selectedLink$, link]}
    , props: {href: `#${txt}`}}, link.meth + ' ' + link.path)
  ])
}

