
'use strict'

const request = require('request')
const globals = require('./modules/globals')

exports.getCategories = function(callback) {  
  const options = {
      url: `https://developers.zomato.com/api/v2.1/categories`,
      method: `GET`,
      headers: {
        'user-key': `53d2f755e44b12d31be6f3db16d397c9`   
      }    
  }

  request(options, function (error, response, body) {
    if (error) {
      //console.log(error)
      return callback(error)
    } else {
      //console.log(response.statusCode, body)
      var result = JSON.parse(body)
      return callback(null, {
				status: globals.status.ok,
				format: globals.format.json,
				message: `${result.length} categories found`,
				body: result.categories
			})
    }
  })
}

/*
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
*/