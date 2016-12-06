'use strict'

//  import the mongoose package
const mongoose = require('mongoose')
const mongo = require('mongodb')
const db = {
	user: 'dbTestUser',
	pass: 'dbt3stus3r'
}

mongoose.connect('mongodb://dbTestUser:dbt3stus3r@ds119548.mlab.com:19548/restaurantstest')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

// create a schema
const userSchema = new Schema({
	name: String,
	username: String,
	password: String
})

//  create a model using the schema
exports.User = mongoose.model('User', userSchema)

//  create a schema
const restaurantSchema = new Schema({
	username: String,
	name: String,
	location: Object,
	cusisines: String,
	delivery: Boolean,
	rating: Object
})

// create a model using the schema
exports.Restaurant = mongoose.model('Restaurant', restaurantSchema)
