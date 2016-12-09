
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
 * @returns {Object} The object of restaurants found.
 * @throws  {Error} No restaurants found.
 */

exports.getRestaurants = (id, type) => new Promise( (resolve, reject) => {
	const itemPromises = ['0', '20', '40', '60', '80'].map( start => new Promise( (resolve, reject) => {
		//const url = `${url}/search?entity_id=${id}&entity_type=${type}&stat=${start}`
		const options = {
			url: `${url}/search?entity_id=${id}&entity_type=${type}&start=${start}`,
			method: 'GET',
			headers: {
				'user-key': userKey
			}
		}

		request.get(options, (err, res, body) => {
			if (err) reject(new Error(`could not get restaurants starting from ${start}`))
			
			const result = JSON.parse(body)
			//console.log(body[0].results_found)
			resolve(result)
		})
	}))

	Promise.all(itemPromises)
		.then( results => {
			cleanData(results)
				.then( response => resolve(response))
				.catch( err => reject(err))
		}).catch( err => reject(err))
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
		console.log(result)

		if(result.id !== id) reject(new Error(`Restaurant with ID ${id} cannot be found`))
		
		const data = {
			link: `/restaurants/${result.id}`,					
			id: result.id,
			name: result.name,
			location: result.location,
			cuisines: result.cuisines,
			table_booking: result.has_table_booking === 0 ? false : true,
			rating: {
				value: result.user_rating.aggregate_rating,
				text: result.user_rating.rating_text,
				votes: result.user_rating.votes
			}
		}
		resolve(data)
	})
})

const cleanData = data  => new Promise((resolve) => {
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
				location: rest.restaurant.location,
				cuisines: rest.restaurant.cuisines,
				table_booking: rest.restaurant.has_table_booking === 0 ? false : true,
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
})

/*
exports.getAllRestaurants = (id, type) => new Promise( (resolve, reject) => {
	const itemPromises = ['0', '20', '40', '60', '80'].map( start => new Promise( (resolve, reject) => {
		//const url = `${url}/search?entity_id=${id}&entity_type=${type}&stat=${start}`
		const options = {
			url: `${url}/search?entity_id=${id}&entity_type=${type}&start=${start}`,
			method: 'GET',
			headers: {
				'user-key': userKey
			}
		}

		request.get(options, (err, res, body) => {
			if (err) reject(new Error(`could not get restaurants starting from ${start}`))
			
			const result = JSON.parse(body)
			//console.log(body[0].results_found)
			resolve(result)
		})
	}))

	Promise.all(itemPromises)
		.then( results => {
			cleanData(results)
				.then( response => resolve(response))
				.catch( err => reject(err))
		}).catch( err => reject(err))
})*/