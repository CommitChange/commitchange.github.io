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
      , h('textarea'
          , {
              props: {
                placeholder: 'Type a query to one of the public end points, and get real results'
            }
          }
        )
    ])
  ])



