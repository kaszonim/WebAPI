'use strict'
/* We import the packages needed for this module. These should be listed in the 'package.json' file and can then be imported automatically using 'npm install' */
const rand = require('csprng')
const globals = require('./global')
const https = require('https')
const queryString = require('querystring')
  
const host = `developers.zomato.com`  
const apiKey = '53d2f755e44b12d31be6f3db16d397c9'
var data = {}
var endpoint = ''
var query = {}

function apiCall (host, endpoint, method, apiKey, query, success) {
  var dataString = JSON.stringify(query)
  var headers = {
    'user-key': apiKey   
  }
	
  if (method === 'GET' && query) {
    endpoint += '?' + queryString.stringify(query);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
	
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers    
  }
	
  var req = https.request(options, function(res){
    res.setEncoding('utf-8')
    var responseString = ''
    
    res.on('data', function(data){
      responseString += data
    })
    
    res.on('end', function(){
			var responseObj = JSON.parse(responseString)
      return success(null, responseObj)
    })
  })
	
  req.on('error', (err) => {
		return success(err)
	})	
  //req.write(dataString)
  req.end()  
}

function getLocationDetails(location){
	endpoint = `/api/v2.1/locations` 
  data = { 'query': location }
  
  //replace with function that returns entityId and entityType
  apiCall(host, endpoint, 'GET', apiKey, data, function (res){
      const entityId = res.location_suggestions[0].entity_id
      const entityType = res.location_suggestions[0].entity_type
			const cityID = res.location_suggestions[0].city_id
			
			data = {
				'entity_id': entityId,
				'entity_type': entityType,
				'city_id': cityID
			}	
			
			return data
	})
}

exports.getCategories = function(callback) {  
  endpoint = `/api/v2.1/categories` 
	let results = {}
  apiCall(host, endpoint, 'GET', apiKey, query, function (err, res){
	 /*console.log('Restaurant categories')
		for(var c in res.categories){
			var cat = res.categories[c].categories
			console.log(cat.id + '. ' + cat.name)
		}
		console.log()*/
		//console.log(res.length)
		
		
		if (res.length  === 0) {
			console.log('No Results')
			/*return {
				status: global.status.notFound,
				format: global.format.json,
				message: 'no lists found'
			}*/
			callback('error')
		}		
		if(res){
			console.log('Results found')
			results = {
				status: globals.status.ok,
				format: globals.format.json,
				message: `${res.length} categories found`,
				body: res.categories
			}
			callback(null, results)
			//console.log(res.categories)
			//console.log('Result code: ' + global.status.ok)
			/*return {
				status: globals.status.ok,
				format: globals.format.json,
				message: `${res.length} categories found`,
				body: res.categories
			}*/
		}
  })
}

exports.getCuisinesInCity = function(location){
	endpoint = `/api/v2.1/locations` 
  data = { 'query': location }
	var cityID = ''
  
  //replace with function that returns entityId and entityType
  apiCall(host, endpoint, 'GET', apiKey, data, function (res){
		cityID = res.location_suggestions[0].city_id
		endpoint = `/api/v2.1/cuisines` 
		data = { 'city_id': cityID }
		
		apiCall(host, endpoint, 'GET', apiKey, data, function (res){
			try {
				console.log()
				console.log(`Cuisines in ${location}`)
				for(var c in res.cuisines){
					var cus = res.cuisines[c].cuisine
					console.log(cus.cuisine_id + '. ' + cus.cuisine_name)
				}
			} catch(err) {
				console.log(`ERROR: ${err.message}`)
			}
  	})	
	})
}

exports.getRestaurantsInArea = function(location) {
	endpoint = `/api/v2.1/locations` 
  data = { 'query': location }
  
  //replace with function that returns entityId and entityType
  apiCall(host, endpoint, 'GET', apiKey, data, function (res){
		const entityId = res.location_suggestions[0].entity_id
		const entityType = res.location_suggestions[0].entity_type
		
		endpoint = `/api/v2.1/location_details`	
		data  = {
			'entity_id': entityId,
			'entity_type': entityType
		}	

		apiCall(host, endpoint, 'GET', apiKey, data, function (res){
			try {
				var rest = res.best_rated_restaurant
				console.log()
				console.log(`Top 10 places in ${location}`)
				for(var r in rest){
					console.log(rest[r].restaurant.name)
				}
			} catch(err) {
			console.log(`ERROR: ${err.message}`)
			}
		})
	})
}