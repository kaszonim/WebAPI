'use strict'

//const data = require('./restaurants')
const request = require('request')
const https = require('https')

const categories = 'categories'
apiCall(categories)

function apiCall(name) {
	const host = `https://developers.zomato.com`  
  const endpoint = `/api/v2.1/${name}`
  const apiKey = '53d2f755e44b12d31be6f3db16d397c9'
	console.log(host + endpoint)
  
  var options = {
    host: host,
    path: endpoint,
    method: 'GET',
    headers: {
      'accept': 'application/json'
      }
  };

  https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  }).end({
    'user-key': '53d2f755e44b12d31be6f3db16d397c9'
  });
}
  
  
/*data.getData(categories, (err, res) => {
  try {
		if (err) throw err
		console.log(JSON.stringify(res, null, 2))
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})*/