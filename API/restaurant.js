'use strict'
/**
 * Restaurant model file.
 * @module Restaurant
 */

const zomato = require('./modules/zomato')
const persistence = require('./modules/persistence')
const auth = require('./modules/authentication.js')
const url = require('url')

/**
 * Gets all categories from zomato API
 * @param   {Function} callback - Callback function
 * @returns {Object} Result object containing total number and categories array
 * @throws  {Error} Error from Zomato request
 */

exports.getCategories = callback => {
	zomato.getCategories()
	.then( response => callback(null, response))
	.catch( err => callback(err))
}

/**
 * Gets category by ID from zomato API
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} Result object containing category for specified ID
 * @throws  {Error} Error from Zomato request
 */

exports.getCategoryById = (request, callback) => {
	const requestId = request.params.id

	zomato.getCategories().then( response => {
		const category = response.categories.find( category => parseInt(category.id) === parseInt(requestId))

		return callback(null, category)
	}).catch(err => callback(err))
}

/**
 * Gets restaurants defaulted to Coventry from zomato API.
 * It can also search for specific location, category, sort the results and order them
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} Result object containing total and restaurants array
 * @throws  {Error} Error from Zomato request
 */

exports.getRestaurants = (request, callback) => {
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

				return zomato.getRestaurants(locationId, locationType, foundCategory.id, sort, order)
			}).then( result => callback(null, result))
            .catch( err => callback(err))
		} else {
			zomato.getRestaurants(locationId, locationType)
            .then( response => callback(null, response))
            .catch( err => callback(err))
		}
	}).catch( err => callback(err))
}

/**
 * Gets restaurants by ID from zomato API
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} Restaurant object
 * @throws  {Error} Error from Zomato request
 */

exports.getRestaurantById = (request, callback) => {
	const id = request.params.id

	zomato.getRestaurantsById(id)
    .then( response => callback(null, response))
    .catch( err => callback(err))
}

/**
 * Gets current user details from database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} User object
 * @throws  {Error} Error from database request
 * @throws  {Error} can only get logged in user
 */

exports.getUser = (request, callback) => {
	const username = request.params.username
	let loggedUser

	auth.getCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return persistence.getUser(credentials.username)
	}).then( credentials => {
		loggedUser = credentials
		auth.verifyPassword(this.password, credentials.password)
	}).then( () => {
		if (username !== this.username) return callback(new Error('can only get logged in user'))
		return cleanMongoData(loggedUser)
	}).then( response => {
		response.password = undefined
		return callback(null, response)
	}).catch( err => callback(err))
}

/**
 * Adds user to database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} User object
 * @throws  {Error} Error from database request
 */

exports.addUser = (request, callback) => {
	auth.getCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return persistence.checkUserExists(credentials)
	}).then( () => auth.hashPassword(this.password))
	.then( password => {
		const data = {
		    name: request.body['name'],
		    username: this.username,
		    password: password
		}

		return persistence.createUser(data)
	}).then( account => callback(null, account) )
	.catch( err => callback(err) )
}

/**
 * Removes user from database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {String} Message for successfull deletion
 * @throws  {Error} Error from database request
 * @throws  {Error} can only deleted logged in user
 */

exports.removeUser = (request, callback) => {
	const username = request.params.username

	auth.getCredentials(request).then( credentials => {
    	this.username = credentials.username
		this.password = credentials.password
		return persistence.getUser(credentials.username)
	}).then( credentials => auth.verifyPassword(this.password, credentials.password)
	).then( () => {
		if (username !== this.username) return callback(new Error('can only delete logged in user'))
		return persistence.deleteUser(username)
	}).then( response => callback(null, response)
	).catch( err => callback(err))
}

/**
 * Gets all users favourites entries from database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} Result object containing total and restaurants array
 * @throws  {Error} Error from database request
 */

exports.getUserFavourites = (request, callback) => {
	auth.getCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password

		return persistence.getUser(credentials.username)
	}).then( credentials => auth.verifyPassword(this.password, credentials.password))
	.then( () => persistence.getFavourites(this.username))
	.then( response => callback(null, response))
	.catch( err => callback(err))
}

/**
 * Gets specific user favourite entry based on ID from database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} Restaurant object
 * @throws  {Error} Error from database request
 */

exports.getUserFavouriteById = (request, callback) => {
	const restaurantId = request.params.id

	auth.getCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return persistence.getUser(credentials.username)
	}).then( credentials => auth.verifyPassword(this.password, credentials.password))
	.then( () => persistence.getFavouriteById(this.username, restaurantId))
	.then( response => cleanMongoData(response))
	.then( data => {
		data.username = undefined
		return callback(null, data)
	}).catch( err => callback(err))
}

/**
 * Adds user favourite entry based on ID to database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} Restaurant object
 * @throws  {Error} Error from database request
 * @throws  {Error} invalid request body
 */

exports.addUserFavourite = (request, callback) => {
	if(request.body === undefined || request.body.id === undefined) return callback(new Error('invalid request body'))
	const comments = request.body.comments === undefined ? '' : request.body.comments
	const restaurantId = request.body.id

	auth.getCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return persistence.getUser(credentials.username)
	}).then( credentials => auth.verifyPassword(this.password, credentials.password))
	.then( () => persistence.checkFavouriteExists(this.username, restaurantId))
	.then( () => zomato.getRestaurantsById(restaurantId))
	.then( response => {
		response.comments = comments
		return persistence.addToFavourites(this.username, response)
	}).then( response => cleanMongoData(response))
	.then( data => {
		data.username = undefined
		return callback(null, data)
	}).catch( err => callback(err))
}

/**
 * Updates user favourite entry based on ID to database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {Object} Restaurant object
 * @throws  {Error} Error from database request
 * @throws  {Error} invalid request body
 */

exports.updateUserFavourite = (request, callback) => {
	if(request.body === undefined || request.body.comments === undefined) return callback(new Error('invalid request body'))
	const restaurantId = request.params.id
	const comments = request.body.comments

	auth.getCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return persistence.getUser(credentials.username)
	}).then( credentials => auth.verifyPassword(this.password, credentials.password))
	.then( () => persistence.updateFavourite(this.username, restaurantId, comments))
	.then( response => cleanMongoData(response))
	.then( data => {
		data.username = undefined
		return callback(null, data)
	}).catch( err => callback(err))
}

/**
 * Deletes user favourite entry based on ID from database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {String} Message for successfull deletion
 * @throws  {Error} Error from database request
 */

exports.deleteUserFavourite = (request, callback) => {
	const restaurantId = request.params.id

	auth.getCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return persistence.getUser(credentials.username)
	}).then( credentials => auth.verifyPassword(this.password, credentials.password))
	.then( () => persistence.deleteFavourite(this.username, restaurantId))
	.then( response => callback(null, response))
	.catch( err => callback(err))
}

/**
 * Deletes all user favourites entries from database
 * @param   {Object} request - Request object
 * @param   {Function} callback - Callback function
 * @returns {String} Message for successfull deletion
 * @throws  {Error} Error from database request
 */

exports.deleteAllUserFavourites = (request, callback) => {
	auth.getCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return persistence.getUser(credentials.username)
	}).then( credentials => auth.verifyPassword(this.password, credentials.password))
	.then( () => persistence.deleteFavourites(this.username))
	.then( response => callback(null, response))
	.catch( err => callback(err))
}

const cleanMongoData = data => new Promise( (resolve, reject) => {
	try {
		data.__v = undefined
		data._id = undefined

		resolve(data)
	} catch (e) {
		reject(e)
	}
})
