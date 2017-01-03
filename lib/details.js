import h from 'snabbdom/h'
import R from 'ramda'
import marked from 'marked'

const isEmpty = obj => !R.toPairs(obj).length 

const none = _ => h('p.mono.grey.p-2.m-0', 'None')


const listGroup = (title, obj) => {
  if(isEmpty(obj)) return ''
  return h('div', [
    h('p.mb-0', `${title}:`)
  , h('ul.mt-1', R.map(a => h('li.small.mono', `${String(a[0])}: ${String(a[1])}`), R.toPairs(obj)))
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
  return h('table', R.map(a => 
    h('tr', [
      h('td.mono.small', String(a[0]))
    , h('td', [
        String(a[1])
      , listGroup('Validations', resp.validations[a[0]])
      , listGroup('Defaults', formatDefault(resp, a))
      ])
    ])
  , R.toPairs(resp.params)))
}

const simpleRow = arr =>
  h('tr', [
    h('td.mono.small', String(arr[0]))
  , h('td', String(arr[1]))
  ])

const simpleTable = obj => {
  if(isEmpty(obj)) return none() 
  return h('table', R.map(a => 
    simpleRow(a)
  , R.toPairs(obj)))
}

const landingPage = introMD =>
  h('article.p-2.col-right', [
    h('p.m-0.p-2.sm-p-1.bg-blue--light', 'Welcome to the CommitChange API')
  , h('p.mt-3', [ h('span', {props: {innerHTML: introMD ? marked(introMD) : ''}}) ])
  ])
  
module.exports = state  => {
  if(!state.selectedLink$()) return landingPage(state.introMD$())
  const {parent, meth, path} = state.selectedLink$()
  const currentRes = state.resources$()[parent][meth][path]
  return h('article.p-2.col-right', [
    h('h5.mono.m-0.bg-blue--light.p-2.sm-p-1', 
        `${state.selectedLink$().meth} ${state.selectedLink$().parent}${state.selectedLink$().path}`)
  , currentRes.description ? h('p.mb0.mt3', currentRes.description) : ''
  , h('hr')
  , h('h4', 'Params')
  , paramsTable(currentRes)
  , h('h4', 'Selectable')
  , simpleTable(currentRes.selectable)
  ])
}


