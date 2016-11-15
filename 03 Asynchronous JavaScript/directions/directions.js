
'use strict'

/**
 * directions module.
 * @module directions
 */

/**
 * Callback used by apiCall
 * @callback apiCallback
 * @param {error} err - error returned (null if no error)
 * @param {data} route - the data returned as an object
 */

const request = require('request')

/**
 * returns the driving distance between two locations
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
exports.getDistance = (origin, destination, callback) => {
	apiCall(origin, destination, (err, route) => {
		if (err) return callback(err)
		return callback(null, `${destination} is ${route.distance.text} from ${origin}`)
	})
}

exports.getDuration = (origin, destination, callback) => {
	apiCall(origin, destination, (err, time) => {
		if (err) return callback(err)
		return callback(null, `${destination} is ${time.duration.text} from ${origin}`)
		//null in the return is the error -  only needs specified when error
	})
}

exports.getDirections = (origin, destination, callback) => {
	apiCall(origin, destination, (err, directions) => {
		if (err) return callback(err)
		var instructions = []
		var steps = directions.steps
		for(let step in steps){
			instructions.push(steps[step].html_instructions)
		}
		return callback(null, instructions)
	})	
}

/**
 * @function apiCall
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
function apiCall(origin, destination, callback) {
	const firstIndex = 0
	const url = `https://maps.googleapis.com/maps/api/directions/json?region=gb&origin=${origin}&destination=${destination}`
	//console.log(url)
	request.get(url, (err, res, body) => {
		if (err) return callback(new Error('Google API error'))
		const json = JSON.parse(body)
		if (json.status !== 'OK') return callback(new Error('invalid location'))
		const result = json.routes[firstIndex].legs[firstIndex]
		return callback(null, result)
	})
}
