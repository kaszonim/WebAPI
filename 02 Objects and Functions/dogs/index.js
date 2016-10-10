
'use strict'

const Dog = require('./dog')

const fido = new Dog('Fido', 'Mixed', 38, true)
const fluffy = new Dog('Fluffy', 'Poodle', 30, false)
const spot = new Dog('Spot', 'Chihuahua', 10, false)
const barnaby = new Dog('Barnaby', 'Basset Hound', 55, true)

spot.bark = function() {
	console.log(`${this.name} says WOOF!`)
}

fido.bark()
fido.run()
fido.wag()

fluffy.bark()
fluffy.run()
fluffy.wag()

spot.bark()
spot.run()
spot.wag()

barnaby.sit()
barnaby.sit()
spot.sit()
fido.sit()

console.log(`Does spot have a sitting property? ${spot.hasOwnProperty('sitting')}`)
console.log(`Does fido have a sitting property? ${fido.hasOwnProperty('sitting')}`)
