
'use strict'

const Employee = require('./employee')

try {
	var dateOfBirth = new Date('February 3, 2000')
	const worker = new Employee('John', 'Doe', dateOfBirth)
	console.log(worker.name)

	const salary = worker.calculateSalary()
	console.log(salary)

	dateOfBirth = new Date('October 28, 1970')
	const manager = new Employee('Peter', 'Piper', dateOfBirth,4)
	console.log(manager.name)
	console.log(manager.calculateSalary(6))
	console.log(manager)

} catch(err) {
	console.log(`ERROR: ${err}`)
}