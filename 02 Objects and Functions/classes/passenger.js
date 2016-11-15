'use strict'

const Person = require('./person')

module.exports = class Passenger extends Person{
  
  constructor(firstname, lastname, dob, airmiles = 0){
    super(firstname, lastname, dob)   
    this.miles = airmiles
  }
  
  addAirMiles(milestoadd = 0){
    this.miles += milestoadd    
  }
  
  get airmiles(){
    return this.miles    
  } 
}