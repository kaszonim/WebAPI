'use strict'

const api = require('./Modules/data')
  
const host = `developers.zomato.com`  
const apiKey = '53d2f755e44b12d31be6f3db16d397c9'
var endpoint = ''
var data = {}

//getCategories()
getRestaurantsInArea('coventry')
//getLocationDetails('coventry')

function getCategories(){  
  endpoint = `/api/v2.1/categories` 
  api.apiCall(host, endpoint, 'GET', apiKey, data, function (res){
    try {
      console.log('Restaurant categories')
      for(var c in res.categories){
        var cat = res.categories[c].categories
        console.log(cat.id + '. ' + cat.name)
      }
    } catch(err) {
      console.log(`ERROR: ${err.message}`)
    }
  })
}

function getRestaurantsInArea(location){
  endpoint = `/api/v2.1/locations` 
  data = { 'query': location }
  var entityId = ''
  var entityType = ''
  
  api.apiCall(host, endpoint, 'GET', apiKey, data, function (res){
    try {
      entityId = res.location_suggestions[0].entity_id
      entityType = res.location_suggestions[0].entity_type
      
      endpoint = `/api/v2.1/location_details`
      data = { 
        'entity_id': entityId,
        'entity_type': entityType
      }
      
      api.apiCall(host, endpoint, 'GET', apiKey, data, function (res){
        try {
          var rest = res.best_rated_restaurant
          //nsole.log(rest[0])
          console.log('top 10 places in Coventry')
          for(var r in rest){
            console.log(rest[r].restaurant.name)
          }
        } catch(err) {
        console.log(`ERROR: ${err.message}`)
        }
      })
    } catch(err) {
      console.log(`ERROR: ${err.message}`)
    }
  })
}

