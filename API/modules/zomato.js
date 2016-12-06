
'use strict'
/**
 * Zomato Module.
 * @module zomato
 */

const request = require('request')

const userKey = '53d2f755e44b12d31be6f3db16d397c9'
const url = 'https://developers.zomato.com/api/v2.1/'

/**
 * Returns all categories found as an object.
 * @returns {Object} The object containing the categories.
 * @throws  {Error} No categories found.
 */
exports.getCategories = () => new Promise( (resolve, reject) => {
	const options = {
		url: `${url}/categories`,
		method: 'GET',
		headers: {
			'user-key': userKey
		}
	}

	request(options, function(error, response, body) {
		if (error) reject(error)
		const result = JSON.parse(body)

		if(result.categories.length === 0) reject(new Error('No categories found'))
		resolve(result.categories)
	})
})

/**
 * Returns details for the named location.
 * @param   {string} location - The location name to retrieve.
 * @returns {Object} The object containing the title, id and type of the location
 * @throws  {Error} No location details found.
 */

exports.getLocationDetails = location => new Promise( (resolve, reject) => {
	const options = {
		url: `${url}/locations?query=${location}`,
		method: 'GET',
		headers: {
			'user-key': userKey
		}
	}

	request(options, function(error, response, body) {
		if (error) reject(error)
		const result = JSON.parse(body)

		if(result.location_suggestions.length === 0) reject(new Error('No location details found'))
		const locationDetails = {
			'id': result.location_suggestions[0].entity_id,
			'type': result.location_suggestions[0].entity_type,
			'title': result.location_suggestions[0].title
		}

		resolve(locationDetails)
	})
})

/**
 * Returns restaurants in for specified entity id and type.
 * @param   {string} id - The location id to retrieve.
 * @param	{string} type - The location type to retrieve.
 * @returns {Object} The object of restaurants found.
 * @throws  {Error} No restaurants found.
 */

exports.getRestaurants = (id, type) => new Promise( (resolve, reject) => {
	const options = {
		url: `${url}/search?entity_id=${id}&entity_type=${type}`,
		method: 'GET',
		headers: {
			'user-key': userKey
		}
	}

	request(options, function(error, response, body) {
		if (error) reject(error)
		const result = JSON.parse(body)

		if (result.results_found === 0)	reject(new Error('No restaurants found'))
		const restDetails = []

		restDetails.push({
			'items_found': result.results_found,
			'items_shown': result.results_shown
		})
		for(const restaurant in result.restaurants){
			restDetails.push({
				'position': restaurant,
				'id': result.restaurants[restaurant].restaurant.id,
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
		resolve(restDetails)
	})
})

exports.getRestaurantsById = id => new Promise( (resolve, reject) => {
	if(id === undefined) reject(new Error('Invalid restaurant ID'))
	const options = {
		url: `${url}/restaurant?res_id=${id}`,
		method: 'GET',
		headers: {
			'user-key': userKey
		}
	}

	request(options, function(error, response, body) {
		if (error) reject(error)
		const result = JSON.parse(body)

		if(result.R.res_id !== id) reject(new Error(`Restaurant with ID ${id} cannot be found`))
		resolve(result)
	})
})

