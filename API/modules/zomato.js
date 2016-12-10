
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
 * @returns {Object} The object containing the total and categories array.
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
		cleanCategoryData(result.categories).then( response => {
			if (!response) reject(new Error('No categories found'))
			resolve(response)
		}).catch( err => reject(err))
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

		if (result.location_suggestions.length === 0) {
			reject(new Error('No location details found'))
		} else {
			const locationDetails = {
				'id': result.location_suggestions[0].entity_id,
				'type': result.location_suggestions[0].entity_type,
				'title': result.location_suggestions[0].title
			}

			resolve(locationDetails)
		}
	})
})

/**
 * Returns restaurants in for specified entity id and type.
 * @param   {string} id - The location id to retrieve.
 * @param	{string} type - The location type to retrieve.
 * @returns {Object} The object containing total and array of restaurants found.
 * @throws  {Error} No restaurants found.
 */

exports.getRestaurants = (id, type, catId, sort, order) => new Promise( (resolve, reject) => {
	const itemPromises = ['0', '20', '40', '60', '80'].map( start => new Promise( (resolve, reject) => {
		//const url = `${url}/search?entity_id=${id}&entity_type=${type}&stat=${start}`
		const options = {
			url: `${url}/search?entity_id=${id}&entity_type=${type}&start=${start}&category=${catId}&sort=${sort}&order=${order}`,
			method: 'GET',
			headers: {
				'user-key': userKey
			}
		}

		request.get(options, (err, res, body) => {
			if (err) reject(new Error(`could not get restaurants starting from ${start}`))
			const result = JSON.parse(body)

			resolve(result)
		})
	}))

	Promise.all(itemPromises)
		.then( results => {
			if (results[0].results_found === 0) reject(new Error('No restaurants found'))

			cleanRestaurantData(results).then( response => {
				if (!response) reject(new Error('No restaurants found'))
				resolve(response)
			}).catch( err => reject(err))
		}).catch( err => reject(err))
})

/**
 * Returns restaurant for specified id.
 * @param   {string} id - The restaurant id to retrieve.
 * @returns {Object} Restaurant object.
 * @throws  {Error} Restaurant with ID ${id} cannot be found.
 */

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

		if(result.R.res_id === 0) reject(new Error(`Restaurant with ID ${id} cannot be found`))
		const data = {
			link: `/restaurants/${result.id}`,
			id: result.id,
			name: result.name,
			location: {
				address: result.location.address,
				locality: result.location.locality,
				city: result.location.city,
				postcode: result.location.zipcode
			},
			cuisines: result.cuisines,
			table_booking: result.has_table_booking === 0 ? 'No' : 'Yes',
			average_cost: result.average_cost_for_two,
			currency: result.currency,
			rating: {
				value: result.user_rating.aggregate_rating,
				text: result.user_rating.rating_text,
				votes: result.user_rating.votes
			}
		}

		resolve(data)
	})
})

const cleanRestaurantData = data => new Promise( (resolve, reject) => {
	try {
		const result = {
			total: 0,
			restaurants: []
		}

		data.forEach(function(element) {
			element.restaurants.forEach(rest => {
				result.restaurants.push({
					link: `/restaurants/${rest.restaurant.id}`,
					id: rest.restaurant.id,
					name: rest.restaurant.name,
					location: {
						address: rest.restaurant.location.address,
						locality: rest.restaurant.location.locality,
						city: rest.restaurant.location.city,
						postcode: rest.restaurant.location.zipcode
					},
					cuisines: rest.restaurant.cuisines,
					table_booking: rest.restaurant.has_table_booking === 0 ? 'No' : 'Yes',
					average_cost: rest.restaurant.average_cost_for_two,
					currency: rest.restaurant.currency,
					rating: {
						value: rest.restaurant.user_rating.aggregate_rating,
						text: rest.restaurant.user_rating.rating_text,
						votes: rest.restaurant.user_rating.votes
					}
				})
			})
		})
		result.total = result.restaurants.length

		resolve(result)
	} catch (err) {
		reject(err)
	}
})

const cleanCategoryData = data => new Promise( (resolve, reject) => {
	try {
		const result = {
			total: 0,
			categories: []
		}

		data.forEach(function(element) {
			result.categories.push({
				link: `/categories/${element.categories.id}`,
				id: element.categories.id,
				name: element.categories.name
			})
		})
		result.total = result.categories.length

		resolve(result)
	} catch (err) {
		reject(err)
	}
})
