'use strict'


const zomato = require('../modules/zomato')

describe('Restaurant API', () => {
	describe('getCategories', () => {
		it('should return results', done => {
			zomato.getCategories().then( (response) => {
				expect(response.total).toBe(14)
				expect(response.categories[0].name).toBe('Delivery')
				done()
			}).catch( err => {
				if (err) expect(true).toBe(false)
				done()
			})
		})

		it('should error if no results found', done => {
			zomato.getCategories().then( response => {
				if (response) expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('No categories found')
				done()
			})
		})
	})

	describe('getLocationDetails', () => {
		it('should find results', done => {
			zomato.getLocationDetails('coventry').then( response => {
				expect(response.id).toBe(94264)
				expect(response.type).toBe('zone')
				done()
			}).catch( err => {
				if (err) expect(true).toBe(false)
				done()
			})
		})

		it('should not find any location details', done => {
			zomato.getLocationDetails('query').then( response => {
				if (response) expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('No location details found')
				done()
			})
		})
	})

	describe('getRestaurants', () => {
		it('should return restaurants', done => {
			zomato.getRestaurants(94264, 'zone').then( response => {
				expect(response.total).toBe(100)
				done()
			}).catch( err => {
				if (err) expect(true).toBe(false)
				done()
			})
		})

		it('should not find restaurants for wrong type', done => {
			zomato.getRestaurants(94264, 'city').then( response => {
				if (response) expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('No restaurants found')
				done()
			})
		})

		it('should not find restaurants for wrong id', done => {
			zomato.getRestaurants(1251, 'zone').then( response => {
				if (response) expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('No restaurants found')
				done()
			})
		})
	})

	describe('getRestaurantsById', () => {
		it('should return restaurant', done => {
			zomato.getRestaurantsById('16681615').then( response => {
				expect(response.name).toBe('Cosmos')
				done()
			}).catch( err => {
				if (err) expect(true).toBe(false)
				done()
			})
		})

		it('should not return for invalid id', done => {
			zomato.getRestaurantsById().then( response => {
				if (response) expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('Invalid restaurant ID')
				done()
			})
		})

		it('should return no results', done => {
			zomato.getRestaurantsById(10000000).catch( err => {
				expect(err.message).toBe('Restaurant with ID 10000000 cannot be found')
				done()
			}).catch( err => {
				if (err) expect(true).toBe(false)
				done()
			})
		})
	})
})
