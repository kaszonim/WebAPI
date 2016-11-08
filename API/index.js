
'use strict'

const data = require('./modules/data.js')
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

const mime = {
	'json': 'application/json',
	'xml': 'application/xml'
}

const defaultPort = 8080

server.get('/categories', function(req, rest) {
	const host = req.headers.host
    
  data.getCategories(function(err, res) {
    console.log(`GET categories request`)
    console.log(`Response ${res.status}`)
	
    rest.setHeader('content-type', res.format)
    rest.setHeader('Allow', 'GET, POST')
    rest.json(res.status, {message: res.message, data: res.body})
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