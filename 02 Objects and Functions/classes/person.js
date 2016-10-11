
'use strict'
/** Class representing a person */
module.exports = class Person {

	/**
	 * Create a person
	 * @param {string} firstname - the person's first name
	 * @param {string} lastname - the person's last name
	 * @param {Date()} dob - the person's date of birth
	 */
	constructor(firstname, lastname, dob) {
		if (firstname === undefined || lastname === undefined || dob === undefined) {
			throw new Error('missing parameter')
		}
		if (typeof dob !== 'object'){
			throw new Error('wrong data type for date')	
		}
		this.first = firstname
		this.last = lastname
		this.dateOfBirth = dob
	}

	/**
	 * Set the person's first name
	 * @param {string} name - the person's first name
	 */
	set firstName(name) {
		this.first = name
	}

	/**
	 * Set the person's last name
	 * @param {string} name - the person's last name
	 */
	set lastName(name) {
		this.last = name
	}
	
	/**
	 * Set the person's date of birth
	 * @param {Date()} name - the person's last name
	 */
	set dob(dob){
		this.dateOfBirth = dob
	}

	/**
	 * Get the person's full name
	 * @return {string} the person's full name
	 */
	get name() {
		return `${this.first} ${this.last}`
	}
	
	/**
	 * Get the person's date of birth
	 * @return {Date()} the person's age (in years)
	 */
	get dob(){
		return this.dateOfBirth
		//return dob
	}
}