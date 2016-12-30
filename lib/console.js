import h from 'snabbdom/h'
import R from 'ramda'
  
module.exports = state  => 
  h('div.fixed.bottom-0.left-0.width-full.bg-white.sh-2.console'
  , {class: {isOpen: state.openConsole$()}}
  , [
      h('div.container.p-2.relative', [
        h('div.bg-blue.color-white.console-tab.cursor-pointer'
        , {on: {click: [state.openConsole$, !state.openConsole$()]}}
        , `${state.openConsole$() ? 'Close' : 'Open'} console`
        )
      , h('form'
        , {on: {submit: state.consoleQuery$}}
        , [
          h('p.mt-0', 'Make a GET request to a public endpoint and see the results below') 
        , h('div.relative', [
            h('span.absolute.top-0.left-0.p-1', 'https://api.commitchange.com/')
          , h('input.console-input'
            , { props: {
                  autofocus: 't'
                , name: 'console-query'
                , placeholder: 'resource/params'
              }}
            )
        ])
      , h('div.py-2', [h('button', 'Make request')])
      ])
    ])
  ])



