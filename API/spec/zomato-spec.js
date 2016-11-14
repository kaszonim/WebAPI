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
	
	it('check location details', () => {
		data.getLocationDetails('coventry').then( (result) => {
			expect(result.body.id).toBe(94264)
			expect(result.body.type).toBe('zone')
		})
	})
	
	it('no location details found', () => {
		data.getLocationDetails('location').then( (result) => {
			expect(result).toBe('No location details found')
		})
	})
	
	it('check return message', () => {
		data.getRestaurant().then( (result) => {
			expect(result.message).toBe('179 restaurants found')
		})
	})
})