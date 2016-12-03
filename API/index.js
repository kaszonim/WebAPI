
'use strict'

const data = require('./restaurant')
const url = require('url')
const restify = require('restify')
const server = restify.createServer()

/* import the required plugins to parse the body and auth header. */
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

const status = {
	'ok': 200,
	'created': 201,
	'noContent': 204,
	'notModified': 304,
	'badRequest': 400,
	'unauthorised': 401,
	'notFound': 404
}

const defaultPort = 8080

server.get('/categories', function(req, res) {
	data.categories( (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			res.send(status.ok, result)
		}
		res.end()
	})
})

server.get('/cuisines?loc=', function(req, res) {
	data.cuisines(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
	})
})

server.get('/restaurants?q=', function(req, res) {
	data.restaurants(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
		res.end()
	})
})

server.get('/users', function(req, res) {
	data.users( (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			console.log(result)
			res.send(status.ok, result)
		}
	})
})/*

server.post('/users', function(req, res) {
	data.addUser(req, (err, result) => {
=======
server.get('/restaurants/:id', function(req, res) {
	data.restaurantById(req, (err, result) => {
>>>>>>> master
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
<<<<<<< HEAD
			res.send(status.created, { user: result })
=======
			res.send(status.ok, result)
>>>>>>> master
		}
		res.end()
	})
})*/
 
server.del('/users/:username', function(req, res) {
	//TO-DO! delete user from database
	data.addUser(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.created, { user: result })
		}
		res.end()
	})
})

server.put('/users/:id', function(req, res) {
	//TO-DO! update user details in database
})

server.get('/favourites', function(req, res) {
	data.favourites(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
	})
})

server.post('/favourites', function(req, res) {
	data.getUsers(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.created, result)
		}
	})
})
/*
server.delete('/favourites/:id', function(req, res) {
	//TO-DO! delete from favourites list based on ID
})*/


//need more functions for PUT and DELETE

const port = process.env.PORT || defaultPort

server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
