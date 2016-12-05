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
    const parameters = url.parse(request.url, true)

    zomato.getLocationDetails(parameters.query.q).then( response => {
        zomato.getRestaurants(response.id, response.type).then( response => {
            if (!response) {
                return callback('No restaurants found')
            } else {
                return callback(null, response)
            }
        })
    }).catch( err => callback(err) )
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
    }).catch( err => callback(err) )
}

exports.removeUser = (request, callback) => {
    /*auth.getCredentials(request).then( credentials => {
        const hash = credentials.password
        console.log('hash: ' + hash)
        console.log('password' + this.password)
		return auth.checkPassword(this.password, hash)
    }).then( () => {
        return persistence.deleteUsers(credentials.username)
    }).then( (response) => callback(null, response) )
    .catch( err => callback(err))

*/
    let user

    auth.getCredentials(request).then( credentials => {
            this.username = credentials.username
            this.password = credentials.password
            return auth.hashPassword(credentials)
        }).then( credentials => {
            console.log(credentials)
            return persistence.getUserAccount(credentials)
        }).then( account => {
            user = account
            console.log(account)
            const hash = account[0].password
            return auth.checkPassword(this.password, hash)
        }).then( () => {
            return persistence.deleteUsers(user.username)
        }).then( response => {
            return callback(response)
        }).catch( err => callback(null, err))

    /*persistence.deleteUsers(request.params.username).then( response => {
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
    })*/
}

exports.restaurantById = (request, callback) => {
    const id = request.params.id

    zomato.getRestaurantsById(id).then( response => {
        return callback(null, response)
    }).catch( err => {
        return callback(err)
    })
}