
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

server.get('/categories', (req, res) => {
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

server.get('/restaurants', (req, res) => {
	data.restaurants(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
		res.end()
	})
})

server.get('/restaurants/:id', (req, res) => {
	data.restaurantById(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
		res.end()
	})
})

server.get('/restaurants/:query', (req, res) => {
	
})

const port = process.env.PORT || defaultPort

server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
