'use strict'
/* import the 'restify' module and create an instance. */
const restify = require('restify')
const server = restify.createServer()

/* import the required plugins to parse the body and auth header. */
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

/* import our custom module. */
const lists = require('./modules/lists.js')
const globals = require('./modules/globals')

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

/* if we receive a GET request for the base URL redirect to /lists */
server.get('/', function(req, res, next) {
	//console.log('ROOT')
	res.redirect('/lists', next)
})

/* this route provides a URL for the 'lists' collection. It demonstrates how a single resource/collection can have multiple representations. */
server.get('/lists', function(req, res) {
	//console.log('getting a list of all the lists')
	/* we will be including URLs to link to other routes so we need the name of the host. Notice also that we are using an 'immutable variable' (constant) to store the host string since the value won't change once assigned. The 'const' keyword is new to ECMA6 and is supported in NodeJS. */
	const host = req.headers.host
	//console.log(`host: ${host}`)
	/* creating some empty variables */
	/* is the client requesting xml data? The req.header object stores any headers passed in the request. The 'Accept' header lets the client express a preference for the format of the representation. Note you should always provide a sensible default. */
	const data = lists.getAll(host)
	console.log(data)
	/* We  send the response code and body. Finally we signal the end of the response. */
	res.setHeader('content-type', data.format)
	res.setHeader('Allow', 'GET, POST')
	res.json(data.status, {message: data.message, data: data.data})
})

/* This route provides a URL for each list resource. It includes a parameter (indicated by a :). The string entered here is stored in the req.params object and can be used by the script. */
server.get('/lists/:listID', function(req, res) {
	//console.log('getting a list based on its ID')
	/* Here we store the id we want to retrieve in an 'immutable variable'. */
	const listID = req.params.listID
	//console.log(req.headers)
	//let lastChecked = undefined
	//if (req.headers['if-modified-since']) {
	//	console.log('header found')
	//	lastChecked = new Date(req.headers['if-modified-since'])
	//}
	//console.log(lastChecked)
	//const lastChecked = req.headers['if-modified-since'] ? new Date(req.headers['if-modified-since']) : undefined
	//console.log(`lastChecked: ${lastChecked}`)
	/* Notice that all the business logic is kept in the 'lists' module. This stops the route file from becoming cluttered and allows us to implement 'unit testing' (we cover this in a later topic) */
	const data = lists.getByID(listID)
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
	res.send(data.code, data.data)
	res.end()
})

/* This route points to the 'lists' collection. The POST method indicates that we indend to add a new resource to the collection. Any resource added to a collection using POST should be assigned a unique id by the server. This id should be returned in the response body. */
server.post('/lists', function(req, res) {
	//console.log('adding a new list')
	/* The req object contains all the data associated with the request received from the client. The 'body' property contains the request body as a string. */
	//console.log('BODY')
	//console.log(req.body)
	//console.log(JSON.stringify(req.body, null, globals.indent))
	/* Since we are using the authorization parser plugin we gain an additional object which contains the information from the 'Authorization' header extracted into useful information. Here we are displaying it in the console so you can understand its structure. */
	const auth = req.authorization
	const data = lists.addNew(auth, req.body)
	//console.log('RETURNED DATA')
	//console.log(data)
	res.setHeader('content-type', data.format)
	res.setHeader('Allow', 'GET, POST')
	if (data.code === globals.status.created) {
		res.setHeader('Location', `/lists/${data.data.id}`)
		res.setHeader('Last-Modified', data.data.modified.toUTCString())
	}
	if (data.data === undefined) {
		res.send(data.status, {message: data.message})
	}
	res.send(data.status, {message: data.message, data: data.data.data})
	res.end()
})

/* The PUT method is used to 'update' a named resource. This is not only used to update a named resource that already exists but is also used to create a NEW RESOURCE at the named URL. It's important that you understand how this differs from a POST request. */
server.put('/lists/:listID', function(req, res) {
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
	res.send(status[status], {status: res.data.status, message: 'this should update the specified resource'})
	res.end()
})

/* The DELETE method removes the resource at the specified URL. */
server.del('/lists/:listID', function(req, res) {
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
	res.send(status.noContent, {status: 'ok', message: 'this should delete the specified resource'})
	res.end()
})

const port = process.env.PORT || defaultPort
server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
