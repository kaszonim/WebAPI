'use strict'

const request = require('request')

try {
	if (process.argv.length < 4) {
		throw 'missing parameter'
	}
	const base = process.argv[2].toUpperCase()
	const symbol = process.argv[3].toUpperCase()
	const url = `http://api.fixer.io/latest?base=${base}&symbols=${symbol}`
	console.log(url)
	request.get( url, (err, res, body) => {
		if (err) {
			throw 'could not complete request'
		}
		var json = JSON.parse(body)
		if(Object.keys(json.rates).length === 0){
			throw 'symbol not valid'
		}
		console.log(`1 ${base} = ${json.rates[symbol].toFixed(2)} ${symbol}`)
			//const output = JSON.stringify(json.rates[symbol].toFixed(2), null, 2)
			//console.log(output)
	})
} catch(err) {
	console.log(err)
}
