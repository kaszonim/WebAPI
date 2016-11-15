
'use strict'

const book = require('./books')

const url = `https://www.amazon.co.uk/dp/1449336361`
book.getHTML(url, (err, res) => {
  try {
		if (err) throw err
		console.log(JSON.stringify(res, null, 2))
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})