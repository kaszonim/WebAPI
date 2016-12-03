'use strict'

//  import the mongoose package
const mongoose = require('mongoose')
const mongo = require('mongodb')
const db = {
	user: 'dbtestuser',
	pass: 'dbt3stus3rS'
}

mongoose.connect('mongodb://'+db.user+':'+db.pass+'@ds119548.mlab.com:19548/restaurantstest')
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
	name: String,
	location: Object,
	cusisines: String,
	delivery: Boolean,
	rating: Object
})

// create a model using the schema
exports.Restaurant = mongoose.model('Restaurant', restaurantSchema)
