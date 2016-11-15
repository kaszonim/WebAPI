'use strict'

const request = require('request')

try {
	if (process.argv.length < 3) {
		throw 'missing parameter'
	}
	let address = process.argv[2]
	/* we need to remove the single quotes from the string */
	address = address.replace(/'/g,'')
	console.log(address)
	const url = `https://maps.googleapis.com/maps/api/geocode/json?region=gb&units=metric&appid=44c39f3fa462f86b3fc88f5678e5c5ff&address=${address}`
	console.log(url)
	request.get( url, (err, res, body) => {
		if (err) {
			throw 'could not complete request'
		}
		const json = JSON.parse(body)
		//if(Object.keys(json.results).length === 0){
		if(!json.results[0]){
			throw 'no results found'
		}else{
			var geoData = json.results[0].geometry
			console.log()
			console.log(`lat: ${geoData.location.lat}, lon: ${geoData.location.lng}`)
			
			var addressComp = json.results[0].address_components
			for(let comp in addressComp){
				console.log(addressComp[comp].long_name)
			}
		}
		//console.log(JSON.stringify(json, null, 2))
		try {
			if (json.status === 'ZERO_RESULTS') {
				throw 'no results found'
			}
		} catch(err) {
			console.log(err)
		}
	})
} catch(err) {
	console.log(err)
}
