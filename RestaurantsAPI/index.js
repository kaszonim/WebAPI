'use strict'

const rest = require('./restaurants')
const request = require('request')
const https = require('https')

const categories = 'categories'
rest.getData(categories,(err, res) => {
	try {
		if (err) throw err
		console.log(res)
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})