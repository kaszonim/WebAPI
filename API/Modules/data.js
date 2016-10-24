'use strict'

const https = require('https')
const queryString = require('querystring')

exports.apiCall = (host, endpoint, method, apiKey, data, success) => {
  var dataString = JSON.stringify(data)
  var headers = {
    'user-key': apiKey   
  }
	
  if (method === 'GET' && data) {
    endpoint += '?' + queryString.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
	
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers    
  }
	
  var req = https.request(options, function(res){
    res.setEncoding('utf-8')
    var responseString = ''
    
    res.on('data', function(data){
      responseString += data
    })
    
    res.on('end', function(){
			var responseObj = JSON.parse(responseString)
      success(responseObj)
    })
  })
	
  req.on('error', (err) => {
		success(err)
	})	
  req.write(dataString)
  req.end()  
}