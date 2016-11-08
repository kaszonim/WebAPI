'use strict'

var data = require("../modules/data")

describe('Shopping List', function () {
  it('should return categories', (done) => {
    data.getCategories(function(err, res) {
      console.log(res.body.length)
		  expect(res.body.length).toBeGreaterThan(0)
      done()
    })
	})
  
  it('return message for no city details', (done) => {
    data.getCityDetails(function(err, res) {
      console.log(res)
      expect(res.message).toBe('No location suggestions for this city')
    })
  })
})