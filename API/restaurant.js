'use strict'

const zomato = require('./modules/zomato')
const url = require('url')

exports.categories = function(callback) {
    zomato.getCategories().then( (response) => {
        if (response.length === 0) {
            return callback('No categories found')
        } else {
            return callback(null, response)
        }
    }).catch(err => {
        return callback(err)
    })
}

exports.restaurants = function(request, callback) {
    const parameters = url.parse(request.url, true)

	zomato.getLocationDetails(parameters.query.q).then( (response) => {
		zomato.getRestaurants(response.id, response.type).then( (response) => {
			if (!response.body) {
                return callback('No restaurants found')
            } else {
                console.log(response)
                return callback(null, response.body)
            }
		})
	}).catch( err => {
		return callback(err)
	})
}