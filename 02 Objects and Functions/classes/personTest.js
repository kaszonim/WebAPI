'use strict'

const Person = require('./person')
try {
	var dateOfBirth = new Date('February 3, 2000')
	const person = new Person('Andy', 'Capp', dateOfBirth)
	console.log(person.name)
	person.lastName = 'Pandy'
	console.log(JSON.stringify(person, null, 2))
	
	var currentDate = new Date()
	var currentYear	 = currentDate.getFullYear()
	console.log(person.name +  ' is ' + (currentYear - person.dob.getFullYear()) + ' years old')
	//const badPerson = new Person('anon')
} catch(err) {
	console.log(`ERROR: ${err}`)
}