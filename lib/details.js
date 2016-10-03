import h from 'snabbdom/h'
import R from 'ramda'
import pretty from 'pretty-js'

const code = json => h('pre.mono.bg-grey.p2.small', pretty(json))

const isEmpty = obj => !R.toPairs(obj).length 

const none = _ => h('p.mono.grey.p2.m0', 'None')


const listGroup = (title, obj) => {
  if(isEmpty(obj)) return ''
  return h('div', [
    h('p.mb0', `${title}:`)
  , h('ul.mt1', R.map(a => h('li.small.mono', `${String(a[0])}: ${String(a[1])}`), R.toPairs(obj)))
  ])
}

const formatDefault = (resp, a) => {
 if(resp.defaults[a[0]]) {
    let x = {}
    x[[a[0]]] = resp.defaults[a[0]] 
    return x
  }
  return ''
}

const paramsTable = resp =>  {
  if(isEmpty(resp.params)) return none() 
  return h('table.fullWidth', R.map(a => 
    h('tr', [
      h('td.p2.mono', String(a[0]))
    , h('td.p2', [
        String(a[1])
      , listGroup('Validations', resp.validations[a[0]])
      , listGroup('Defaults', formatDefault(resp, a))
      ])
    ])
  , R.toPairs(resp.params)))
}


const simpleRow = arr =>
  h('tr', [
    h('td.p2.mono', String(arr[0]))
  , h('td.p2', String(arr[1]))
  ])

const simpleTable = obj => {
  if(isEmpty(obj)) return none() 
  return h('table.fullWidth', R.map(a => 
    simpleRow(a)
  , R.toPairs(obj)))
}
  
module.exports = state  => {
  if(!state.selectedLink$()) return ''
  const {parent, meth, path} = state.selectedLink$()
  const currentRes = state.resources$()[parent][meth][path]
  return h('article.flex-auto.p2', [
    h('div.bg-blue--light.p2' , [
      h('h3.mono.m0', 
        `${state.selectedLink$().meth} ${state.selectedLink$().parent + state.selectedLink$().path}`)
    , h('p.mb0', currentRes.description)
    ])
  , h('hr')
  , h('h3', 'Params')
  , paramsTable(currentRes)
  , h('h3', 'Selectable')
  , simpleTable(currentRes.selectable)
  ])
}


