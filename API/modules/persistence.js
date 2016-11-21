'use strict'

const schema = require('../schema/schema')

exports.addAccount = details => new Promise( (resolve, reject) => {
	/*if (!'username' in details && !'password' in details && !'name' in details) {
		reject(new Error('invalid user object'))
	}*/
	if(!details.username || !details.password || !details.name){
		reject(new Error('invalid user object'))
	}

	const user = new schema.User(details)

	user.save( (err, user) => {
		if (err) {
			reject(new Error('error creating account'))
		}
		delete details.password
		resolve(details)
	})
})