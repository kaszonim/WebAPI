'use strict'

const zomato = require('./modules/zomato')
const persistence = require('./modules/persistence')
const url = require('url')

exports.categories = (callback) => {
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

exports.restaurants = (request, callback) => {
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

exports.addUser = (request, callback) => {
    const parameters = url.parse(request.url, true)
    console.log(parameters.query.username)
    console.log(parameters.query.password)
	
	//return persistence.createUser(data)
}

exports.users = (callback) => {
    persistence.getUsers().then( (response) => {
        if(!response){
            return callback('No users found')
        } else {
            const cleanData = response.map( element => {
                return {
                    username: element.username,
                    name: element.name
                }
            })
            return callback(null, cleanData)
        }
    }).catch( err => {
        return callback(err)
    })
}