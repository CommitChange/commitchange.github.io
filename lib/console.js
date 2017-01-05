import h from 'snabbdom/h'
import tableData from 'table-data'
import R from 'ramda'
  
const form = state =>
  h('form'
  , {on: {submit: state.consoleQuery$}}
  , [
    h('p.mt-0', 'Make a GET request to a public endpoint and see the results below') 
  , h('div.relative.table.width-full', [
      h('span.absolute.top-0.left-0.p-1', 'https://api.commitchange.com/')
    , h('span.table-cell.width-full', [ 
        h('input.console-input.rounded-left'
        , { props: {
              value: String(state.selectedLink$().parent || '').replace('/', '') + 
                (state.selectedLink$().path || '')
          }}
        )
      ])
    , h('button.table-cell.rounded-right', {attrs: {disabled: state.loading$()}}, 'GET')
    ])
  ])

const tabs = state =>
  h('ul.tabs--h.m-0.bg-grey-1', [
    tab(state, 'JSON')
  , tab(state, 'Table')
  ])

const tab = (state, type) => 
  h('li', {
    on: {click: [state.consoleResultType$, type]}
  , class: {'is-selected': state.consoleResultType$() === type}
  }
  , type)

const JSONResults = state =>
  h('pre.m-0.p-2'
  , {class: {
      hide: state.consoleResultType$() !== 'JSON'
    , 'opacity-025' : state.loading$()
    }}
  , [
      h('code.small'
      , {props: {
          innerHTML: JSON.stringify(state.consoleQueryResponse$().body, null, 2)
        }}
      )
    ]
  )

const tableResults = state => {
  const data = tableData(state.consoleQueryResponse$().body)
  return h('div.overflow-auto.py-2'
  , {class: {
      hide: state.consoleResultType$() !== 'Table'
    , 'opacity-025' : state.loading$()
    }}
  , [
      h('table.font-size-09.width-full'
      , R.concat(
          [h('tr', R.map(th => h('th', th), data.header || []))]
        , R.map(tr => h('tr', R.map(td => h('td', td || []), tr || [])), data.rows)
        )
      )
    ]
  )
}


module.exports = state  => 
  h('div.fixed.bg-white.console'
  , {class: {isOpen: state.openConsole$()}}
  , [
      h('div.p-2.relative.container', [
        form(state)
      , h('div.border.rounded.mt-4', [
          tabs(state)
        , h('div', [
            JSONResults(state)
          , tableResults(state)
          ])
      ])
    ])
  ])



