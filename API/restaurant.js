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
    //By default it will only return coventry restaurants
	zomato.getLocationDetails('coventry').then( response => {
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