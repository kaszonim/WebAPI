'use strict'

const request = require('request')
const https = require('https')

exports.getData = (name, callback) => {
  apiCall(name, (err, res) => {
    if (err) return callback(err)
    return callback(null, res)
  })
}

function apiCall(name) {
	const host = `developers.zomato.com`  
  const endpoint = `/api/v2.1/${name}`
	console.log(host + endpoint)
  
  var options = {
    host: host,
    path: endpoint,
    method: 'GET',
		port: 443,
    headers: {
			'user-key': '53d2f755e44b12d31be6f3db16d397c9',
      'accept': 'application/json',
			'content-type': 'application/json'
      }
  };
		
	https.request(options, function(res) {
    //console.log('STATUS: ' + res.statusCode)
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
		
		res.setEncoding('utf8');
    res.on('data', function (chunk) {	
			var data = JSON.parse(chunk)
			for(var c in data.categories){
				console.log(data.categories[c].categories.id + '. ' + data.categories[c].categories.name)
			}
			//chunk = JSON.parse(chunk)
    });
  }).end();
}