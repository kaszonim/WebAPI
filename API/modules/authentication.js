'use strict'
/**
 * Authentication module.
 * @module Authentication
 */

const bcrypt = require('bcryptjs')

/**
 * Gets user credentials from request
 * @param   {Object} request - The http request object
 * @returns {Object} Result object containing username and password
 * @throws  {Error} authorization header missing
 * @throws  {Error} username/password must be provided
 */

exports.getCredentials = request => new Promise( (resolve, reject) => {
	if (request.authorization === undefined || request.authorization.basic === undefined) reject(new Error('authorization header missing'))
	const auth = request.authorization.basic

	if (auth.username === undefined || auth.password === undefined) reject(new Error('username/password must be provided'))
	resolve({username: auth.username, password: auth.password})
})

/**
 * Encrypts user password
 * @param   {Object} credentials - The user credentials object. Must contain password property
 * @returns {Object} Result object containing username and password
 * @throws  {Error} credentials must be provided
 * @throws  {Error} password must be provided
 */

exports.hashPassword = password => new Promise( (resolve, reject) => {
	if (password === undefined) reject(new Error('password must be provided'))
	password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

	resolve(password)
})

/**
 * Checks user password
 * @param   {string} provided - The user password to be checked
 * @param   {string} stored - The user password stored in database
 * @returns {} Nothing if passwords match
 * @throws  {Error} password provided/stored missing
 * @throws  {Error} invalid password
 */

exports.verifyPassword = (provided, stored) => new Promise( (resolve, reject) => {
	if (provided === undefined || stored === undefined) reject(new Error('password provided/stored missing'))
	if (!bcrypt.compareSync(provided, stored)) reject(new Error('invalid password'))
	resolve()
})
