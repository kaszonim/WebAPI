'use strict'

// import the mongoose package
const mongoose = require('mongoose')
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

// create a model using the schema
exports.User = mongoose.model('User', userSchema)

// create a schema
const restaurantSchema = new Schema({
	name: String,
    location: Object,
    cusisines: String,
    delivery: Boolean,
    rating: Object
})

// create a model using the schema
exports.Book = mongoose.model('Restaurant', restaurantSchema)