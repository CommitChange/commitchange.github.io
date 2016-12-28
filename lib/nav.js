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
      , h('a.title.bold', {props: {href: '/'}}, 'CommitChange API') 
      , h('hr.mt-1')
      ])
    , h('section', [
        h('div.pb-2.mono', R.map(navSub(state), R.toPairs(state.resources$())))
      , h('hr.mt-0')
      , h('a.ml-1', {on: {click: state.refreshOptions$}, props: {href: '#'}}, 'Refresh docs')
      ])
    ]
  )

const navSub = state => ([name, subOption]) => {
  const subLinks = R.compose(
   R.map(navLink(state, name))
  )(state.navLinks$()[name])
    
  return h('ul.mb-2.pl-0', [
    h('li.table.m-0', [
      h('span.bold.table-cell.align-middle.py-1.pr-1', name)
    , h('span.table-cell.small.align-middle.caret.opacity-025', {props: {innerHTML: '&#9660;'}})
    ])
  , state.selectedLink$().parent === name ? h('ul.mt-0.small', subLinks) : ''
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

