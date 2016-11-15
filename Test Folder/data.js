
'use strict'

const request = require('request')
const globals = require('./globals')

exports.getCategories = function(callback) {  
  const options = {
      url: `https://developers.zomato.com/api/v2.1/categories`,
      method: `GET`,
      headers: {
        'user-key': `53d2f755e44b12d31be6f3db16d397c9`   
      }    
  }

  request(options, function (error, response, body) {
    if (error) {
      //console.log(error)
      return callback(error)
    } else {
      //console.log(response.statusCode, body)
      var result = JSON.parse(body)
      return callback(null, {
				status: globals.status.ok,
				format: globals.format.json,
				message: `${result.length} categories found`,
				body: result.categories
			})
    }
  })
}

