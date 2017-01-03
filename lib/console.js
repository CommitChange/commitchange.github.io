import h from 'snabbdom/h'
import R from 'ramda'
  
const form = state =>
  h('form'
  , {on: {submit: state.consoleQuery$}}
  , [
    h('p.mt-0', 'Make a GET request to a public endpoint and see the results below') 
  , h('div.relative', [
      h('span.absolute.top-0.left-0.p-1', 'https://api.commitchange.com/')
    , h('input.console-input'
      , { props: {
            autofocus: 't'
          , placeholder: 'resource/params'
        }}
      )
  ])
  , h('div.py-2'
    , [h('button', {attrs: {disabled: state.loading$()}}, 'Make request')]
    )
  ])

const tabs = state =>
  h('ul.tabs--h', [
    tab(state, 'Table')
  , tab(state, 'JSON')
  ])

const tab = (state, type) => 
  h('li', {
    on: {click: [state.consoleResultType$, type]}
  , class: {'is-selected': state.consoleResultType$() === type}
  }
  , type)

const JSONResults = state =>
  h('pre', {class: {hide: state.consoleResultType$() !== 'JSON'}}
  , [
      h('code.small'
      , {props: {
          innerHTML: JSON.stringify(state.consoleQueryResponse$().body, null, 2)
        }}
      )
    ]
  )


module.exports = state  => 
  h('div.fixed.bg-white.console'
  , {class: {isOpen: state.openConsole$()}}
  , [
      h('div.container.p-2.relative', [
        form(state)
      , h('div', [
          tabs(state)
        , state.loading$() 
          ? ''
          : h('div', [JSONResults(state)])
      ])
    ])
  ])



