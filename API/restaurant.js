'use strict'

const zomato = require('./modules/zomato')
const persistence = require('./modules/persistence')
const url = require('url')

exports.categories = callback => {
    zomato.getCategories().then( response => {
        if (response.length === 0) return callback('No categories found')
        else return callback(null, response)
    }).catch(err => {
        return callback(err)
    })
}

exports.restaurants = (request, callback) => {
    const parameters = url.parse(request.url, true)

	zomato.getLocationDetails(parameters.query.q).then( response => {
		zomato.getRestaurants(response.id, response.type).then( response => {
			if (!response) {
                return callback('No restaurants found')
            } else {
                return callback(null, response)
            }
		})
	}).catch( err => {
		return callback(err)
	})
}

exports.restaurantById = (request, callback) => {
    const id = request.params.id

    zomato.getRestaurantsById(id).then( response => {
        return callback(null, response)
    }).catch( err => {
        return callback(err)
    })
}