'use strict'

const zomato = require('./modules/zomato')
const persistence = require('./modules/persistence')
const auth = require('./modules/authentication.js')
const url = require('url')

exports.categories = callback => {
    zomato.getCategories().then( response => {
        if (response.length === 0) return callback(new Error('No categories found'))
        return callback(null, response)
    }).catch( err => callback(err))
}

exports.categoryById = (request, callback) => {
	const requestId = request.params.id

	zomato.getCategories().then( response => {
		if (response.length === 0) return callback(new Error('Category not found'))
		const category = response.categories.find( category => parseInt(category.id) === parseInt(requestId))

		return callback(null, category)
	}).catch(err => callback(err))
}

exports.restaurants = (request, callback) => {
	const parameters = url.parse(request.url, true)
	const location = parameters.query.location === undefined ? 'coventry' : parameters.query.location
	const requestCategory = parameters.query.category === undefined ? null : parameters.query.category
	const sort = parameters.query.sort === undefined ? '' : parameters.query.sort
	const order = parameters.query.order === undefined ? '' : parameters.query.order

	//By default it will only return coventry restaurants
	zomato.getLocationDetails(location).then( response => {
		const locationId = response.id
		const locationType = response.type

		if (requestCategory) {
			zomato.getCategories().then( response => {
				const foundCategory = response.categories.find( category => category.name.toLowerCase() === requestCategory.toLowerCase())

				if (!foundCategory) return callback(new Error('Category could not be found'))
				return zomato.getRestaurants(locationId, locationType, foundCategory.id, sort, order)
			}).then( result => {
				if (!response) return callback(new Error('No restaurants found'))
				return callback(null, result)
			}).catch( err => callback(err))
		} else {
			zomato.getRestaurants(locationId, locationType).then( response => {
				if (!response) return callback(new Error('No restaurants found'))
				return callback(null, response)
			})
		}
	}).catch( err => callback(err))
}

exports.restaurantById = (request, callback) => {
	const id = request.params.id

	zomato.getRestaurantsById(id).then( response => {
		if (!response) return callback(new Error('No restaurant found'))
		return callback(null, response)
	}).catch( err => callback(err))
}

exports.addUser = (request, callback) => {
    let data

    auth.getCredentials(request).then( credentials => auth.hashPassword(credentials))
    .then( credentials => {
        data = credentials
        return persistence.checkUserExists(credentials)
    }).then( () => {
        data.name = request.body['name']
        return persistence.createUser(data)
    }).then( account => callback(null, account) )
    .catch( err => callback(err) )
}

exports.getUsers = callback => {
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
    }).catch( err => callback(err) )
}

exports.removeUser = (request, callback) => {
    let user

    auth.getCredentials(request).then( credentials => {
            this.username = credentials.username
            this.password = credentials.password
            return auth.hashPassword(credentials)
        }).then( credentials => {
            return persistence.getUser(credentials)
        }).then( account => {
            user = account[0]
            const hash = account[0].password
            return auth.verifyPassword(this.password, hash)
        }).then( () => {
            return persistence.deleteUser(user.username)
        }).then( response => {
            return callback(null, response)
        }).catch( err => callback(err))
}

exports.userFavourites = (request, callback) => {
    let user

    auth.getCredentials(request).then( credentials => {
            this.username = credentials.username
            this.password = credentials.password
            return auth.hashPassword(credentials)
        }).then( credentials => {
            return persistence.getUser(credentials)
        }).then( account => {
            user = account[0]
            const hash = account[0].password
            return auth.verifyPassword(this.password, hash)
        }).then( () => {
            return persistence.getFavourites(user.username)
        }).then( response => {
            return callback(null, response)
        }).catch( err => callback(err))
}

exports.addUserFavourites = (request, callback) => {
    let user
    let restaurant = {}

    auth.getCredentials(request).then( credentials => {
            this.username = credentials.username
            this.password = credentials.password
            return auth.hashPassword(credentials)
        }).then( credentials => {
            return persistence.getUser(credentials)
        }).then( account => {
            user = account[0]
            const hash = account[0].password
            return auth.verifyPassword(this.password, hash)
        }).then( () => {
            if(!request.body) return callback('invalid request body')
            const restaurantId = request.body.id

            return zomato.getRestaurantsById(restaurantId)
        }).then( response => {
            restaurant = response

            return persistence.checkFavouriteExists(user.username, response.id)
        }).then( () => {
            console.log('restaurant:', restaurant)
            return persistence.addToFavourites(user.username, restaurant)            
        }).then( response => {
            return callback(null, response)
        }).catch( err => callback(err))
}

exports.deleteAllUserFavourites = (request, callback) => {
    let user
    let restaurant = {}

    auth.getCredentials(request).then( credentials => {
            this.username = credentials.username
            this.password = credentials.password
            return auth.hashPassword(credentials)
        }).then( credentials => {
            return persistence.getUser(credentials)
        }).then( account => {
            user = account[0]
            const hash = account[0].password
            return auth.verifyPassword(this.password, hash)
        }).then( () => {
            return persistence.deleteFavourites(user.username)
        }).then( response => {
            return callback(null, response)
        }).catch( err => callback(err))
}

exports.deleteUserFavourite = (request, callback) => {
    let user
    const restaurantId = request.params.id

    auth.getCredentials(request).then( credentials => {
            this.username = credentials.username
            this.password = credentials.password
            return auth.hashPassword(credentials)
        }).then( credentials => {
            return persistence.getUser(credentials)
        }).then( account => {
            user = account[0]
            const hash = account[0].password
            return auth.verifyPassword(this.password, hash)
        }).then( () => {
            return persistence.deleteFavourite(user.username, restaurantId)
        }).then( response => {
            return callback(null, response)
        }).catch( err => callback(err))
}