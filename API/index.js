
'use strict'

const data = require('./modules/zomato.js')
const restify = require('restify')
const server = restify.createServer()

/* import the required plugins to parse the body and auth header. */
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

const defaultPort = 8080

server.get('/categories', function(req, rest) {
	data.getCategories(function(err, res) {
		try{
			if (err){
				throw err
			} else{
				console.log('GET categories request')
				console.log(`Response ${res.status}`)

				rest.setHeader('content-type', res.format)
				rest.setHeader('Allow', 'GET, POST')
				rest.json(res.status, {message: res.message, data: res.body})
				rest.end()
			}
		} catch(err){
			console.log(err)
		}
	})
})

server.get('/city/:cityName', function(req, rest) {
	data.getCityDetails(req.params.cityName , function(err, res) {
		if(err){
			throw err
		}else{
			console.log('GET city request')
			console.log(`Response ${res.status}`)
			rest.setHeader('content-type', res.format)
			rest.setHeader('Allow', 'GET, PUT, DELETE')
			rest.json(res.status, {message: res.message, data: res.body})
			rest.end()
		}
	})
})

server.get('/restaurants/:location', function(req, rest) {
	try{
		data.getLocationDetails(req.params.location).then( (response) => {
			data.getRestaurants(response.id, response.type).then( (response) => {
				console.log('GET city request')
				console.log(`Response ${response.status}`)
				rest.setHeader('content-type', response.format)
				rest.setHeader('Allow', 'GET')
				rest.json(response.status, {message: response.message, data: response.body})
				rest.end()
			})
		}) 
	} catch (err) {
		console.log(err)
	}
})

const port = process.env.PORT || defaultPort

server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
