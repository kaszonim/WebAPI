'use strict'

var data = require("../modules/zomato")

describe('Restaurant API', function () {
  it('check returned categories', (done) => {
    data.getCategories(function(err, res) {
		  expect(res.body.length).toBeGreaterThan(0)
      done()
    })
	})
  
  it('return message for no city details', (done) => {
    data.getCityDetails('coventry', function(err, res) {
      expect(err).toBe('No location suggestions for this city')
      done()
    })
  })
  
  it('check returned city details', (done) => {
    data.getCityDetails('london', function(err, res) {
      expect(res.body.length).toBeGreaterThan(0)
      done()
    })
  })
	
	xit('check location details', () => {
		data.getLocationDetails('coventry').then( (result) => {
			expect(result.body.id).toBe(94264)
			expect(result.body.type).toBe('zone')
		})
	})
	
	it('check return message', () => {
		data.getRestaurant().then( (result) => {
			expect(result.message).toBe('179 restaurants found')
		})
	})
})