'use strict'

const request = require('request')
const https = require('https')


exports.getData = (name, callback) => {
  apiCall(name, (err, res) => {
    if (err) return callback(err)
    return callback(null, res)
  })
}

function apiCall(name, callback) {
	const host = `developers.zomato.com`  
  const endpoint = `/api/v2.1/${name}`
  const apiKey = '53d2f755e44b12d31be6f3db16d397c9'
	console.log(host + endpoint)
  
  var options = {
  host: host,
  path: endpoint,
  method: 'GET',
  haders: {
    'user-key': apiKey
  }
};

https.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
}).end();
	
  //quest.get(url, (err, res, body) => {
  // (err) return callback(new Error('API error'))
  //nst json = JSON.parse(body)
  //turn callback(null, json)
//
}