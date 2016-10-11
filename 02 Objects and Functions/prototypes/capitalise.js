'use strict'

module.exports = function() {
  //console.log(this);
  //TO-DO for each word in the string
  return this.charAt(0).toUpperCase() + this.slice(1,this.length);
}