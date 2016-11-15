
'use strict'

const request = require('request')
const cheerio = require('cheerio')

exports.getHTML = (url, callback) => {
	apiCall(url, (err, html) => {
		if (err) return callback(err)
		var $ = cheerio.load(html);  
    var bookDetails = {}
    bookDetails.title = $('#productTitle').text()
    bookDetails.authors = $('.author').val()
    console.log(bookDetails.authors)
		return callback(null,  bookDetails)
	})
}

function apiCall(url, callback) {
	//console.log(url)
	request.get(url, (err, res, body) => {
		if (err) return callback(new Error('Url call error'))
		return callback(null, body)
	})
}