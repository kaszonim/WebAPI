
'use strict'

const defaultSize = 8
const defaultShots = 0

module.exports = function(roast, ounces = defaultSize, shots = defaultShots) { // can't use arrow functions here...
	if (roast === undefined) {
		throw new Error('missing roast type')
	}
	this.roast = roast
	this.ounces = ounces
	this.shots = shots
	this.getSize = () => {
		//Switch statement
		/*switch (this.ounces){
			case 8: return 'small';
			case 12: return 'medium';
			case 16: return 'large';
			default: break;				
		}*/
		
		//Modified if statement
		if (this.ounces <= 8){
			return 'Small'
		}else if (this.ounces >= 9 && this.ounces <= 12){
			return 'Medium'
		}else if (this.ounces > 12){
			return 'Large'
		}
		
		//Original if statement
		/*if (this.ounces === 8) {
			return 'small'
		} else if (this.ounces === 12) {
			return 'medium'
		} else if (this.ounces === 16) {
			return 'large'
		}*/
	}
	this.order = () => {
		let msg
		switch (this.getSize()) {
		case 'small':
		case 'medium':
		case 'large':
				switch (this.shots){
					case (this.shots > 2): msg  =`You've ordered a strong ${this.getSize()} ${this.roast} coffee.` 
						break
					default: msg = `You've ordered a ${this.getSize()} ${this.roast} coffee.`
				}
			break
		default:
			msg = `We don't have a ${this.roast} in that size!`
			break
		}
		return msg
	}
}
