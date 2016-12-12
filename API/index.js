
'use strict'

const data = require('./restaurant')
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

server.get('/categories/:id', (req, res) => {
	data.categoryById(req, (err, result) => {
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
			res.send(status.badRequest, {error: err.message})
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

server.post('/users', (req, res) => {
	data.addUser(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'POST')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.created, result)
		}
	})
})

server.del('/users/:username', (req, res) => {
	data.removeUser(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
		res.end()
	})
})

server.put('/users/:username', (req, res) => {
	/*TO-DO! 
		Update user name
	*/
})

server.get('/favourites', (req, res) => {
	data.userFavourites(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST', 'DELETE')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
	})
})

server.post('/favourites', (req, res) => {
	data.addUserFavourites(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST', 'DELETE')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.created, result)
		}
	})
})

server.del('/favourites', (req, res) => {
	data.deleteAllUserFavourites(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST', 'DELETE')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
	})
})

server.get('/favourites/:id', (req, res) => {
	data.getFavouriteById(res, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST', 'DELETE')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
	})
})

server.del('/favourites/:id', (req, res) => {
	data.deleteUserFavourite(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST', 'DELETE')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
	})
})


server.put('/favourites/:id', function(req, res) {
	data.updateUserFavourite(req, (err, result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET', 'POST', 'DELETE')
		if (err) {
			res.send(status.badRequest, { error: err.message })
		} else {
			res.send(status.ok, result)
		}
	})
})

const port = process.env.PORT || defaultPort

server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
