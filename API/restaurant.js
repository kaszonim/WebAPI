'use strict'

const zomato = require('./modules/zomato')
const persistence = require('./modules/persistence')
const url = require('url')

/*<<<<<<< HEAD
exports.categories = (callback) => {
    zomato.getCategories().then( (response) => {
        if (response.length === 0) {
            return callback('No categories found')
        } else {
            return callback(null, response)
        }
=======
exports.categories = callback => {
    zomato.getCategories().then( response => {
        if (response.length === 0) return callback('No categories found')
        else return callback(null, response)
>>>>>>> master
    }).catch(err => {
        return callback(err)
    })
}*/

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

exports.addUser = (request, callback) => {
    /*const parameters = url.parse(request.url, true)
    console.log(parameters.query.username)
    console.log(parameters.query.password)
	
	//return persistence.createUser(data)*/
    if (request.body === undefined || request.body['name'] === undefined || request.body['password'] === undefined || request.body['username'] === undefined) {
        callback(new Error('Request body missing'))
    } else {
        persistence.createUser({
            'name': request.body['name'],
            'username': request.body['username'],
            'password': request.body['password']
        }).then( resolve => {
            console.log(resolve)
            return callback(null, resolve)
        }).catch( err => {
            return callback(err)
        })
    }
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

exports.removeUsers = (request, callback) => {
    persistence.deleteUsers(request.params.username).then( response => {
        if(!response) {
            return callback(new Error('User cannot be deleted'))
        } else {
            const cleanData = response.map( element => {
                return {
                    username: element.username,
                    name: element.name
                }
            })
            return callback(null, cleanData)
        }
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