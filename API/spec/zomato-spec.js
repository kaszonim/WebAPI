'use strict'

var data = require("../modules/zomato")

describe('Restaurant API', function () {
  xit('check returned categories', (done) => {
    data.getCategories(function(err, res) {
		  expect(res.body.length).toBeGreaterThan(0)
      done()
    })
	})
  
  xit('return message for no city details', (done) => {
    data.getCityDetails('coventry', function(err, res) {
      expect(err).toBe('No location suggestions for this city')
      done()
    })
  })
  
  xit('check returned city details', (done) => {
    data.getCityDetails('london', function(err, res) {
      expect(res.body.length).toBeGreaterThan(0)
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
})