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
			const credentails = {
				id: user._id,
				name: user.name,
				username: user.username
			}
			resolve(credentails)
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

exports.getUserAccount = credentials => new Promise( (resolve, reject) => {
	schema.User.find({username: credentials.username}, (err, docs) => {
		if (err) reject(new Error('database error'))
		if (docs.length) resolve(docs)
		reject(new Error(`invalid username`))
	})
})

exports.deleteUser = provided => new Promise( (resolve, reject) => {
	if(provided === undefined) reject(new Error('missing username'))
	schema.User.remove({ username: provided}, function(err, removed) {
		if (err) reject(err)
		if (removed === 0) reject(new Error(`${provided} cannot be deleted`))
		resolve(`${provided} deleted successfully`)
	})
})

exports.checkExists = account => new Promise( (resolve, reject) => {
	if(account === undefined) reject(new Error('missing username'))
	schema.User.find({username: account.username}, (err, docs) => {
		if (docs.length) reject(new Error(`username already exists`))
		resolve()
	})
})

exports.addToFavourites = (user, restaurant) => new Promise( (resolve, reject) => {
	if (user === undefined || restaurant === undefined) reject(new Error('username/restaurant must be provided'))
	restaurant.username = user
	new schema.Restaurant(restaurant).save( (err, restaurant) => {
		if (err) reject(err)
		resolve(restaurant)
	})
})

exports.deleteFavourite = (user, restaurantId) => new Promise( (resolve, reject) => {
	if (user === undefined || restaurantId === undefined) reject(new Error('username/restaurantId must be provided'))
	schema.Restaurant.remove({_id: restaurantId, username: user}, (err, removed) => {
		if (err) reject(err)
		if (removed.result.n === 0) reject(new Error(`${restaurantId} cannot be found in users favourites`))
		resolve(`${restaurantId} has been deleted successfully`)
	})
})

exports.deleteFavourites = user => new Promise( (resolve, reject) => {
	if (user === undefined) reject(new Error('username must be provided'))
	schema.Restaurant.remove({username: user}, (err, removed) => {
		if (err) reject(err)
		if (removed.result.n === 0) reject(new Error(`${user} does not have any favourites`))
		resolve(`${user} favourites have been deleted successfully`)
	})
})

exports.updateFavourite = (user, restaurant) => new Promise( (resolve, reject) => {

})

exports.getFavourites = user => new Promise( (resolve, reject) => {

})
