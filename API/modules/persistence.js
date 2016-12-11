'use strict'

const schema = require('../schema/test-schema')

exports.createUser = details => new Promise( (resolve, reject) => {
	if(!details.username || !details.password || !details.name){
		reject(new Error('invalid user object'))
	} else {
		new schema.User(details).save( (err, user) => {
			if (err) {
				reject(new Error('error creating account'))
			}
			resolve({
				id: user._id,
				name: user.name,
				username: user.username
			})
		})
	}
})

exports.getUsers = () => new Promise( (resolve, reject) => {
	schema.User.find({}, function(err, users) {
		if (err) reject(err)
		if (users.length === 0) reject(new Error('no users found'))
		resolve(users)
	})
})

exports.getUser = credentails => new Promise( (resolve, reject) => {
	schema.User.find({username: credentails.username}, function(err, user) {
		if (err) reject(err)
		if (user.length === 0) reject(new Error('no user found'))
		resolve(user)
	})
})

exports.deleteUser = provided => new Promise( (resolve, reject) => {
	if(provided === undefined) reject(new Error('missing username'))
	schema.User.remove({ username: provided}, function(err, removed) {
		if (err) reject(err)
		if (removed.result.n === 0) reject(new Error(`${provided} cannot be deleted`))
		resolve(`${provided} deleted successfully`)
	})
})

exports.checkUserExists = account => new Promise( (resolve, reject) => {
	if(account === undefined) reject(new Error('missing username'))
	schema.User.find({username: account.username}, (err, docs) => {
		if (docs.length) reject(new Error(`username already exists`))
		resolve()
	})
})

exports.addToFavourites = (username, restaurant) => new Promise( (resolve, reject) => {
	if (username === undefined || restaurant === undefined) reject(new Error('username/restaurant must be provided'))
	restaurant.username = username
	new schema.Restaurant(restaurant).save( (err, restaurant) => {
		if (err) reject(err)
		restaurant.__v = undefined
		restaurant._id = undefined
		restaurant.username = undefined

		resolve(restaurant)
	})
})

exports.deleteFavourite = (username, restaurantId) => new Promise( (resolve, reject) => {
	if (username === undefined || restaurantId === undefined) reject(new Error('username/restaurantId must be provided'))
	schema.Restaurant.remove({id: restaurantId, username: username}, (err, removed) => {
		if (err) reject(err)
		if (removed.result.n === 0) reject(new Error(`${restaurantId} cannot be found in users favourites`))
		resolve(`${restaurantId} has been deleted successfully`)
	})
})

exports.deleteFavourites = username => new Promise( (resolve, reject) => {
	if (username === undefined) reject(new Error('username must be provided'))
	schema.Restaurant.remove({username: username}, (err, removed) => {
		if (err) reject(err)
		if (removed.result.n === 0) reject(new Error(`${username} does not have any favourites`))
		resolve(`${username} favourites have been deleted successfully`)
	})
})

exports.checkFavouriteExists = (username, restaurantId) => new Promise( (resolve, reject) => {
	if(username === undefined || restaurantId === undefined) reject(new Error('username/restaurantId must be provided'))
	schema.Restaurant.find({id: restaurantId, username: username}, (err, docs) => {
		if (docs.length) reject(new Error('restaurant already exists in the favourites list'))
		resolve()
	})
})

exports.updateFavourite = (username, updateDetails) => new Promise( (resolve, reject) => {
	//What would you actually update?
	//Should I add a new field something like favourites order - which can be update?
})

exports.getFavourites = username => new Promise( (resolve, reject) => {
	if (username === undefined) reject(new Error('username must be provided'))
	const favourites = {
		total: 0,
		restaurants: []
	}

	schema.Restaurant.find({username: username}, (err, found) => {
		if (err) reject(err)
		if (found.length === 0) resolve({ message: `no favourites found for user ${username}` })
		
		found.forEach(element => {
			element.__v = undefined
			element._id = undefined
			element.username = undefined
		}, this);
		favourites.total = found.length
		favourites.restaurants = found
		
		resolve(favourites)
	})
})
