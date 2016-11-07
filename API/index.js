'use strict'

const api = require('./modules/data.js')
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

server.get('/categories', function(req, res) {
	const host = req.headers.host
  const data = api.getCategories()
	console.log('Data is ' + data)
 /* for(var d in data){
    var cat = data[d].categories
    console.log(cat.id + '. ' + cat.name)
  }*/
  res.setHeader('content-type', data.format)
	res.setHeader('Allow', 'GET, POST')
	res.json(data.status, {message: data.message, data: data.data})
})

//api.getCategories()
//api.getCuisinesInCity('coventry')
//api.getRestaurantsInArea('coventry')

const port = process.env.PORT || defaultPort
server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})