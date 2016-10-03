import request from 'flyd-ajax'
import flyd from 'flyd'
import flyd_mergeAll from 'flyd/module/mergeall'
import flyd_obj from 'flyd/module/obj'
import R from 'ramda'

const flyd_flatMap = R.curryN(2, require('flyd/module/flatmap'))

// First make an OPTIONS request to root /, which gives us all table names
// For each table name, make a request to /table_name
// Compose all those results into a single object like: 
// {
//   table_name1: {GET: {...}, docs_url: '...', path: '/table_name1'}
// , table_name2: {GET: {...}, docs_url: '...', path: '/table_name1'}
// }
module.exports = () => {
  const url = "https://api.commitchange.com"

  // A stream of top-level API resources
  const rootOptions$ = flyd.map(
    resp => resp.body.resources
  , request({method: 'options', url, path: "/"}).load 
  )
  // stream of arrays of resource/table names available in the api
  const resources$ = flyd.merge(flyd.stream([]), rootOptions$)


  // Function that makes a request to the path to get the options data for a single resource
  // Returns an ajax response stream
  const getOptions = path => flyd.map(
    resp => resp.body
  , request({method: 'options', url, path}).load
  )

  return R.compose(
    flyd_flatMap(flyd_obj.stream)
  , flyd.map(R.fromPairs) // convert pairs to object
  , flyd.map(paths => R.map(p => [p, getOptions(p)], paths))
  )(resources$)
}


