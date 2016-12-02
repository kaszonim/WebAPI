'use strict'

var data = require("../modules/zomato")

describe('Restaurant API', () => {
	describe('getCategories', () => {
		it('should return results', done => {
			data.getCategories().then( (response) => {
				expect(response.length).toBeGreaterThan(0)
				done()
			})
		})

		it('should error if no results found', done => {
			data.getCategories().then( response => {
				expect(true).toBe(false)
				done()
			}).catch ( err => {
				expect(err.message).toBe('No categories found')
				done() 
			})
		})
	})

	describe('getLocationDetails', () => {
		it('should find results', done => {
			data.getLocationDetails('coventry').then( response => {
				expect(response.id).toBe(94264)
				expect(response.type).toBe('zone')
				done()
			})
		})
		
		it('should not find any location details', done => {
			data.getLocationDetails('query').catch( err => {
				expect(err.message).toBe('No location details found')
				done()
			})
		})
	})

	describe('getRestaurants', () => {
		it('shoudl return restaurants', done => {
			data.getRestaurants(94264, 'zone').then( result => {
				expect(result[0].items_found).toBe(179)
				done()
			})
		})
		
		it('should not find restaurants for wrong type', done => {
			data.getRestaurants(94264, 'city').then( result => {
				expect(true).toBe(false)
				done()
			}, (err) => {
				expect(err).toBe('No restaurants found')
				done()
			})
		})
		
		it('should not find restaurants for wrong id', done => {
			data.getRestaurants(1251, 'zone').then( result => {
				expect(result).toBe('')
				done()
			}, (err) => {
				expect(err).toBe('No restaurants found')
				done()
			})
		})
		
		it('should return full response body', done => {
			data.getRestaurants(94264, 'zone').then( result => {
				expect(result[0].items_shown).toBe(result[0].items_found)
				done()
			})
		})
	})

	describe('getRestaurantsById', () => {
		it('should return restaurant', done => {
			data.getRestaurantsById(16681615).then( result => {
				expect(result.name).toBe('Cosmos')
				done()
			})
		})

		it('should not return for invalid id', done => {
			data.getRestaurantsById().catch( err => {
				expect(err.message).toBe('Invalid restaurant ID')
				done()
			})
		})

		it('should return no results', done => {
			data.getRestaurantsById(10000000).catch( err => {
				expect(err.message).toBe('Restaurant with ID 10000000 cannot be found')
				done()
			})
		})
	})
})