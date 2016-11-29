'use strict'

const schema = require('../schema/schema')

exports.createUser = details => new Promise( (resolve, reject) => {
	if(!details.username || !details.password || !details.name){
		reject(new Error('invalid user object'))
	} else {
		const user = new schema.User(details)

		user.save( (err, user) => {
			if (err) {
				reject(new Error('error creating account'))
			}
			delete details.password
			resolve(details)
		})
	}
})

exports.getUsers = function() {
	return new Promise( (resolve, reject) => {
		const result = ''
		schema.User.find({}, function(err, users) {
			if (err) {
				reject(err)
			}
			// object of all the users
			if (users.length === 0) {
				reject(new Error('no users found'))
			}
			resolve(users)
		})
	})
}

exports.deleteUsers = function(usernam) {
	return new Promise( (resolve, reject) => {
		if(usernam === undefined){
			schema.User.remove(function(err, removed) {
				if (err) {
					reject(err)
				}
				if (removed === 0){
					reject(new Error('users cannot be deleted'))
				} else {
					resolve('All users removed successfully')
				}
			})
		} else {
			schema.User.remove({}, function(err, removed) {
				if (err) {
					reject(err)
				}
				if (removed === 0){
					reject(new Error('users cannot be deleted'))
				} else {
					resolve(removed)
				}
			})
		}
	})



	// username came as part of the URL
	const username = req.params.username

	// username must match authorization username
	const authuser = req.authorization.basic.username
	if (username !== authuser) return res.send(400, {message: 'You can\'t delete other users!'})

	// if it matches then connect to the store and delete
	usersConnection(res, usersDB => {
		usersDB.removeItem(username, err => {
			if (err) return res.send(500, {message: 'Could not delete user.'})

			// if successful then delete all of the user's favourites
			favouritesConnection(req, res, favourites => {
				favourites.clearSync()
			})

			return res.send({message: `User ${username} and all favourites deleted`})
		})
	})
}