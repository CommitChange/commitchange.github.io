import h from 'snabbdom/h'
import R from 'ramda'
  
module.exports = state  => 
  h('div.fixed.bg-white.console'
  , {class: {isOpen: state.openConsole$()}}
  , [
      h('div.container.p-2.relative', [
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
      , h('div.py-2', [h('button', 'Make request')])
      ])
    , h('pre'
      , [
          h('code.small', {props: {
            innerHTML: JSON.stringify(state.consoleQueryResponse$().body, null, 2)
          }})
        ]
      )
    ])
  , h('button.bg-blue.color-white.console-button.sh-1.z-2'
    , {on: {click: [state.openConsole$, !state.openConsole$()]}}
    , [h('i.material-icons', state.openConsole$() ? 'keyboard_arrow_right' : 'keyboard_arrow_left')]
    )
  ])



