 'use strict'

//  import the mongoose package
 const mongoose = require('mongoose')
 const mongo = require('mongodb')
 const db = {
 	user: 'dbwebapiuser',
 	pass: 'dbus3r'
 }

/*const uri = 'mongodb://dbwebapiuser:dbus3r@ds155747.mlab.com:55747/restaurants'
mongo.MongoClient.connect(uri, function(err, db){
	if(err) console.log(err)

	console.log('connected')
	db.close()
})*/

 mongoose.connect('mongodb://dbwebapiuser:dbus3r@ds155747.mlab.com:55747/restaurants')
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
 exports.Book = mongoose.model('Restaurant', restaurantSchema)





/*
'use strict'

 import the mongoose package
const mongoose = require('mongoose')
const mongo = require('mongodb')
const db = {
	user: 'dbwebapiuser',
	pass: 'dbus3r'
}

const uri = 'mongodb:test:test@ds155747.mlab.com:55747/restaurants'
mongo.MongoClient.connect(uri, function(err, db){
	if(err) console.log(err)

	console.log('connected')
	db.close()
})*/