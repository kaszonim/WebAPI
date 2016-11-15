
'use strict'

const Person = require('./person')

module.exports = class Employee extends Person {

	constructor(firstname, lastname, dob, grade = 1) {
		super(firstname, lastname, dob)
		this.joinedDate = new Date()
		this.grade = grade
	}

	calculateSalary(months = 1) {
		return this.grade * 1000 * months
	}

}