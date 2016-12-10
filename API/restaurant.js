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

exports.categoryById = (request, callback) => {
    const requestId = request.params.id

    zomato.getCategories().then( response => {
        if (response.length === 0) return callback('No categories found')
        const category = response.categories.find( category => parseInt(category.id) === parseInt(requestId))

        return callback(null, category)
    }).catch(err => {
        return callback(err)
    })
}

exports.restaurants = (request, callback) => {
    const parameters = url.parse(request.url, true)
    //By default it will only return coventry restaurants

    zomato.getLocationDetails('coventry').then( response => {
        const locationId = response.id
        const locationType = response.type
        const requestCategory = parameters.query.category === undefined ? null : parameters.query.category
        const sort = parameters.query.sort === undefined ? '' : parameters.query.sort
        const order = parameters.query.order === undefined ? '' : parameters.query.order

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
        return callback(null, response)
    }).catch( err => {
        return callback(err)
    })
}