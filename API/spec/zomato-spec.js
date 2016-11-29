'use strict'

/*istanbul ignore next*/
/* global expect */

var data = require("../modules/zomato")

describe('Restaurant API', function () {
<<<<<<< HEAD
	it('getCategories - results returned', (done) => {
		data.getCategories().then( (response) => {
			expect(response.length).toBeGreaterThan(0)
			done()
		})
=======
  it('getCategories - results returned', done => {
    data.getCategories().then( (response) => {
		  expect(response.length).toBeGreaterThan(0)
      done()
    })
>>>>>>> master
	})

	it('getCategories - results not found', done => {
		data.getCategories().then( response => {
			expect(response).toBe('')
			done()
		}, (err) => {
			expect(err.message).toBe('No categories found')
			done()
		}).catch ( err => {
			expect(err.message).toBe('No categories found')
			done() 
		})
	})

	it('getLocationDetails - results', done => {
		data.getLocationDetails('coventry').then( response => {
			expect(response.id).toBe(94264)
			expect(response.type).toBe('zone')
			done()
		})
	})
	
	it('getLocationDetails - no location details found', done => {
		data.getLocationDetails('query').catch( err => {
			expect(err.message).toBe('No location details found')
			done()
		})
	})
	
	it('getRestaurants - return message', done => {
		data.getRestaurants(94264, 'zone').then( result => {
			expect(result[0].items_found).toBe(179)
			done()
		})
	})
	
	it('getRestaurants - no restaurants found for wrong type', done => {
		data.getRestaurants(94264, 'city').then( result => {
			expect(result).toBe('')
			done()
		}, (err) => {
			expect(err).toBe('No restaurants found')
			done()
		})
	})
	
	it('getRestaurants - no restaurants found for wrong id', done => {
		data.getRestaurants(1251, 'zone').then( result => {
			expect(result).toBe('')
			done()
		}, (err) => {
			expect(err).toBe('No restaurants found')
			done()
		})
	})
	
<<<<<<< HEAD
	xit('getRestaurants - response body', (done) => {
		data.getRestaurants(94264, 'zone').then(	(result) => {
			//console.log(result)
			//expect(true).toBe(true)
			expect(result.body.length).toBe(result.body[0].items_shown)
=======
	it('getRestaurants - response body', done => {
		data.getRestaurants(94264, 'zone').then( result => {
			expect(result[0].items_shown).toBe(result[0].items_found)
>>>>>>> master
			done()
		})
	})

	it('getRestaurantsById - response', done => {
		data.getRestaurantsById(16681615).then( result => {
			expect(result.name).toBe('Cosmos')
			done()
		})
	})

	it('getRestaurantsById - invalid id', done => {
		data.getRestaurantsById().catch( err => {
			expect(err.message).toBe('Invalid restaurant ID')
			done()
		})
	})

	it('getRestaurantsById - no results', done => {
		data.getRestaurantsById(10000000).catch( err => {
			expect(err.message).toBe('Restaurant with ID 10000000 cannot be found')
			done()
		})
	})
})