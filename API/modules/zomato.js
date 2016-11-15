
'use strict'

const request = require('request')
const globals = require('./globals')

const userKey = '53d2f755e44b12d31be6f3db16d397c9'
const url = 'https://developers.zomato.com/api/v2.1/'

exports.getLocationDetails = function(location) {
	return new Promise( (resolve, reject) => {
		const options = {
			url: `${url}/locations?query=${location}`,
			method: 'GET',
			headers: {
				'user-key': userKey
			}
		}

		request(options, function(error, response, body) {
			if (error) {
				reject(error)
			} else {
				const result = JSON.parse(body)

				if(result.location_suggestions.length === 0) {
					reject('No location details found')
				} else {
					const locationDetails = {
						'id': result.location_suggestions[0].entity_id,
						'type': result.location_suggestions[0].entity_type,
						'title': result.location_suggestions[0].title
					}

					resolve(locationDetails)
				}
			}
		})
	})
}

exports.getRestaurants = function(id, type) {
	return new Promise( (resolve, reject) => {
		const options = {
			url: `${url}/search?entity_id=${id}&entity_type=${type}`,
			method: 'GET',
			headers: {
				'user-key': userKey
			}
		}

		request(options, function(error, response, body) {
			if (error) {
				//console.log(error)
				reject(error)
			} else {
				const result = JSON.parse(body)

				if (result.results_found > 0){
					const restDetails = []

					restDetails.push({
						'items_shown': result.results_found
					})
					for(const restaurant in result.restaurants){
						restDetails.push({
							'name': result.restaurants[restaurant].restaurant.name,
							'location': result.restaurants[restaurant].restaurant.location,
							'cuisines': result.restaurants[restaurant].restaurant.cuisines,
							'delivery': result.restaurants[restaurant].restaurant.has_online_delivery === 0 ? false : true,
							'rating': {
								'value': result.restaurants[restaurant].restaurant.user_rating.aggregate_rating,
								'rate': result.restaurants[restaurant].restaurant.user_rating.rating_text,
								'votes': result.restaurants[restaurant].restaurant.user_rating.votes
							}
						})
					}

					resolve({
						status: globals.status.ok,
						format: globals.format.json,
						message: `${result.results_found} restaurants found`,
						body: restDetails
					})
				} else {
					reject('No restaurants found')
				}
			}
		})
	})
}

/*
exports.getCategories = function(callback) {
	const options = {
		url: `${url}/categories`,
		method: 'GET',
		headers: {
			'user-key': userKey
		}
	}

	request(options, function(error, response, body) {
		if (error) {
			//console.log(error)
			return callback(error)
		}else {
			//console.log(response.statusCode, body)
			const result = JSON.parse(body)

			return callback(null, {
				status: globals.status.ok,
				format: globals.format.json,
				message: `${result.categories.length} categories found`,
				body: result.categories
			})
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
*/