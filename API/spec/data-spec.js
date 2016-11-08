'use strict'

var data = require("../modules/data")

describe('Restaurant API', function () {
  it('check returned categories', (done) => {
    data.getCategories(function(err, res) {
      console.log(res.body.length)
		  expect(res.body.length).toBeGreaterThan(0)
      done()
    })
	})
  
  it('return message for no city details', (done) => {
    data.getCityDetails('coventry', function(err, res) {
      console.log(err)
      expect(err).toBe('No location suggestions for this city')
      done()
    })
  })
  
  it('check returned city details', (done) => {
    data.getCityDetails('london', function(err, res) {
      console.log(res.body)
      expect(res.body.length).toBeGreaterThan(0)
      done()
    })
  })
})