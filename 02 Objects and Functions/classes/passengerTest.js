
'use strict'

const Passenger = require('./passenger')

try {
  var dob = new Date('January 1, 1978')
  const pass = new Passenger('John', 'Doe', dob, 3)
  console.log(JSON.stringify(pass, null, 2))
  
  pass.addAirMiles(5)
  console.log(pass.airmiles)
  
} catch(err) {
  console.log(`ERROR: ${err}`)
}