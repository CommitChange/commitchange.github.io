import R from 'ramda'

// takes an object, converts it to an array,
// sorts the array by the 0th element (the key)
// and then converts the array back to an object
module.exports = obj => 
  R.fromPairs(
    R.sort((a,b) => R.toLower(a[0]) > R.toLower(b[0]), R.toPairs(obj))
  )

