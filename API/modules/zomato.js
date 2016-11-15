
'use strict'
/**
 * Zomato Module.
 * @module zomato
 */

const request = require('request')
const globals = require('./globals')

const userKey = '53d2f755e44b12d31be6f3db16d397c9'
const url = 'https://developers.zomato.com/api/v2.1/'

/** Returns all categories found as an object. */
exports.getCategories = function() {
	return new Promise( (resolve, reject) => {
		const options = {
			url: `${url}/categories`,
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
				console.log(result.categories.length)

				if(result.categories.length === 0){
					reject(new Error('No categories found'))
				} else {
					resolve(result.categories)
				}
			}
		})
	})
}

/**
 * Returns details for the named location.
 * @param   {string} location - The location name to retrieve.
 * @returns {Object} The object containing the title, id and type of the location
 * @throws  {Error} No location details found.
 */

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

/**
 * Returns restaurants in for specified entity id and type.
 * @param   {string} id - The location id to retrieve.
 * @param	{string} type - The location type to retrieve.
 * @returns {Object} The object of restaurants found.
 * @throws  {Error} No restaurants found.
 */

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
