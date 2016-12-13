'use strict'

//  import the mongoose package
const mongoose = require('mongoose')
const mongo = require('mongodb')
const db = {
	user: 'dbwebapiuser',
	pass: 'dbus3r'
}

mongoose.connect('mongodb://'+db.user+':'+db.pass+'@ds155747.mlab.com:55747/restaurants')
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
	id: String,
	name: String,
	location: Object,
	cusisines: String,
	table_booking: String,
	average_cost: Number,
	currency: String,
	rating: Object,
	comments: String
})

// create a model using the schema
exports.Restaurant = mongoose.model('Restaurant', restaurantSchema)
