'use strict'

var data = require("../modules/zomato")

describe('Restaurant API', function () {
  it('getCategories - results returned', (done) => {
    data.getCategories().then( (response) => {
		  expect(response.length).toBeGreaterThan(0)
      done()
    })
	})

	it('getCategories - results not found', (done) => {
		data.getCategories().then( (response) => {
			expect(response).toBe('')
			done()
		}, (err) => {
			expect(err.message).toBe('No categories found')
			done()
		})
	})

	it('getLocationDetails - results', (done) => {
		data.getLocationDetails('coventry').then( (response) => {
			expect(response.id).toBe(94264)
			expect(response.type).toBe('zone')
			done()
		}, (err) => {
			expect(err).toBe('No location details found')
			done()
		})
	})
	
	it('getLocationDetails - no location details found', (done) => {
		data.getLocationDetails('query').then( (result) => {
			expect(result).toBe('')
			done()
		}, (err) => {
			expect(err).toBe('No location details found')
			done()
		})
	})
	
	it('getRestaurants - return message', (done) => {
		data.getRestaurants(94264, 'zone').then( (result) => {
			expect(result.message).toBe('179 restaurants found')
			done()
		})
	})
	
	it('getRestaurants - no restaurants found for wrong type', (done) => {
		data.getRestaurants(94264, 'city').then( (result) => {
			expect(result).toBe('')
			done()
		}, (err) => {
			expect(err).toBe('No restaurants found')
			done()
		})
	})
	
	it('getRestaurants - no restaurants found for wrong id', (done) => {
		data.getRestaurants(1251, 'zone').then( (result) => {
			expect(result).toBe('')
			done()
		}, (err) => {
			expect(err).toBe('No restaurants found')
			done()
		})
	})
	
	it('getRestaurants - response body', (done) => {
		data.getRestaurants(94264, 'zone').then(	(result) => {
			//console.log(result)
			//expect(true).toBe(true)
			expect(result.body.length).toBe(result.body[0].items_shown)
			done()
		}, (err) => {
			console.log(err)
			done()
		}).catch( err => {
			console.log(err)
			done()
		})
	})
})