'use strict'

module.exports = function() {
  //console.log(this);
  return this.charAt(0).toUpperCase() + this.slice(1,this.length);
}