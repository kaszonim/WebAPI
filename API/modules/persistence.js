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
			delete user.password
			resolve(user)
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

exports.deleteUsers = inUsername => new Promise( (resolve, reject) => {
	if(inUsername === undefined){
		schema.User.remove(function(err, removed) {
			if (err) reject(err)
			if (removed === 0) reject(new Error('users cannot be deleted'))
			resolve('All users removed successfully')
		})
	} else {
		schema.User.remove({ username: inUsername}, function(err, removed) {
			if (err) reject(err)
			if (removed === 0) reject(new Error('users cannot be deleted'))
			resolve(`${inUsername} deleted successfully`)
		})
	}
})
