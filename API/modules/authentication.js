'use strict'

const bcrypt = require('bcryptjs')

exports.getCredentials = request => new Promise( (resolve, reject) => {
	if (request.authorization === undefined || request.authorization.basic === undefined) {
		reject(new Error('authorization header missing'))
	}
	const auth = request.authorization.basic

	if (auth.username === undefined || auth.password === undefined) {
		reject(new Error('missing username / password'))
	}
	resolve({username: auth.username, password: auth.password})
})

exports.hashPassword = credentials => new Promise( (resolve, reject) => {
  if (credentials === undefined) reject(new Error('missing credentials'))
	if (credentials.password === undefined) reject(new Error('missing password'))

	const salt = bcrypt.genSaltSync(10)
  credentials.password = bcrypt.hashSync(credentials.password, salt)
  resolve(credentials)
})

exports.verifyPassword = (provided, stored) => new Promise( (resolve, reject) => {
  if (provided === undefined || stored === undefined) reject(new Error('missing provided/stored password'))
	if (!bcrypt.compareSync(provided, stored)) {
		reject(new Error('invalid password'))
	}
  resolve()
})