'use strict'

const zomato = require('./modules/zomato')
const persistence = require('./modules/persistence')
const auth = require('./modules/authentication.js')
const url = require('url')

exports.categories = callback => {
    zomato.getCategories().then( response => {
        if (response.length === 0) return callback('No categories found')
        return callback(null, response)
    }).catch( err => callback(err))
}

exports.restaurants = (request, callback) => {
    //const parameters = url.parse(request.url, true)

    //By default it will show only restaurants in Coventry
    zomato.getLocationDetails('coventry').then( response => {
        zomato.getRestaurants(response.id, response.type).then( response => {
            if (!response) {
                return callback('No restaurants found')
            } else {
                return callback(null, response)
            }
        })
    }).catch( err => callback(err) )
}

exports.restaurantById = (request, callback) => {
    const id = request.params.id

    zomato.getRestaurantsById(id).then( response => {
        return callback(null, response)
    }).catch( err => {
        return callback(err)
    })
}

exports.addUser = (request, callback) => {
    let data

    auth.getCredentials(request).then( credentials => auth.hashPassword(credentials))
    .then( credentials => {
        data = credentials
        return persistence.checkExists(credentials)
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
            restaurant = request.body
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