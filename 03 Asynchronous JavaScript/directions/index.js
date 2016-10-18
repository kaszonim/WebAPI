
'use strict'

const readline = require('readline-sync')
const directions = require('./directions')

const origin = String(readline.question('start address: ')).trim()
const destination = String(readline.question('finish address: ')).trim()

directions.getDistance(origin, destination, (err, distance) => {
	try {
		if (err) throw err
		console.log(distance)
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})

directions.getDuration(origin, destination, (err, duration) => {
	try {
		if (err) throw err
		console.log(duration)
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})

directions.getDirections(origin, destination, (err, direction) => {
	try {
		if (err) throw err
		console.log('Directions: ')
		console.log(direction)
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})

console.log('EOF')
