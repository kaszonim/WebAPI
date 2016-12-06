'use strict'

var persist = require('../modules/persistence')
var schema = require('../schema/test-schema')

describe('API data persistence', () => {
    describe('users persistence', () => {
        beforeEach( done => {
            schema.User.remove({}, err => {
                if (err) expect(true).toBe(false)
                const details = {
                    'name': 'John Doe',
                    'username': 'jdoe',
                    'password': 't3st'
                }
                new schema.User(details).save( (err, list) => {
                    if (err) expect(true).toBe(false)
                    schema.User.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(1)
                        done()
                    })
                })
            })
        })

        describe('createUser', () => {
            it('should fail - invalid user object', done => {
                const details = {
                    'password': '',
                    'name': 'test name'
                }

                persist.createUser(details).then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('invalid user object')
                    done()
                })
            })

            it('should create user', done => {
                const details = {
                    'username': 'testuser',
                    'password': 't3stus3r',
                    'name': 'Test User'
                }

                persist.createUser(details).then( response => {
                    expect(response.username).toBe('testuser')
                    expect(response.password).toBe(undefined)
                    expect(response.name).toBe('Test User')
                    schema.User.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(2)
                        done()
                    })
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })

            it('should fail if error in creating account', done => {
                const details = {
                    'username': 'testuser',
                    'password': 't3stus3r',
                    'name': 'Test User'
                }

                persist.createUser(details).then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('error creating account')
                    done()
                })
            })
        })

        describe('getUsers', () => {
            //Needs to be uncommented to be able to test the fail bit
            /*  beforeEach( done => {
                schema.User.remove({}, err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })*/

            it('should return users', done => {
                persist.getUsers().then( response => {
                    expect(response.length).toBe(1)
                    done()
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })
                
            it('should fail', done => {
                persist.getUsers().then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('no users found')
                    done()
                })
            })
        })

        describe('deleteUsers', () => {
            it('should fail on missing username', done => {
                persist.deleteUser().then( response => {
                if (response) expect(true).toBe(false)
                done()
                }).catch( err => {
                    expect(err.message).toBe('missing username')
                    done()
                })
            })


            it('should delete one user', done => {
                persist.deleteUser('jdoe').then( response => {
                    expect(response).toBe('jdoe deleted successfully')
                    schema.User.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(0)
                        done()
                    })
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })
        })

        describe('checkExists', () => {
            it('should error on missing username', done => {
                persist.checkExists().then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('missing username')
                    done()
                })
            })

            it('should find existing username', done => {
                persist.checkExists('jdoe').then( () => {
                    expect(true).toBe(true)
                    done()
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })

            it('should fail to find the username', done => {
                persist.checkExists('jdoe2').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username already exists')
                    done()
                })
            })
        })
    })

    describe('favourites persistence', () => {
        let restaurantId
        beforeEach( done => {
            schema.User.remove({}, err => {
                if (err) expect(true).toBe(false)
                const details = {
                    name: 'John Doe',
                    username: 'jdoe',
                    password: 't3st'
                }
                new schema.User(details).save( (err, user) => {
                    if (err) expect(true).toBe(false)
                    schema.User.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(1)
                        done()
                    })
                })
            })

            schema.Restaurant.remove({}, err => {
                if (err) expect(true).toBe(false)
                const restaurant = {
                    username: 'jdoe',
                    name: 'Cosmos',
                    location:  {
                        address: '36-42 Corporation St, Coventry, UK CV1 1',
                        locality: 'Coventry',
                        city: 'West Midlands',
                        city_id: 330,
                        latitude: '52.4094114000',
                        longitude: '-1.5140075000',
                        zipcode: 'CV1 1',
                        country_id: 215
                    },
                    cuisines: 'Chinese, Italian',
                    delivery: false,
                    rating: {
                        value: '3.9',
                        rate: 'Good',
                        votes: '290'
                    }
                }

                new schema.Restaurant(restaurant).save( (err, restaurant) => {
                    if (err) expect(true).toBe(false)
                    restaurantId = restaurant._id

                    schema.Restaurant.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(1)
                        done()
                    })
                })
            })
        })

        describe('addToFavourites', () => {
            it('should error if no user provided', done => {
                const restaurant = {
                    name: 'Akbars',
                    location: {
                        address: '7 Butts, West Midlands, UK CV1 3',
                        locality: 'Coventry',
                        city: 'West Midlands',
                        city_id: 330,
                        latitude: '52.4046430000',
                        longitude: '-1.5214160000',
                        zipcode: 'CV1 3',
                        country_id: 215
                    },
                    cuisines: 'Indian',
                    rating: {
                        value: '3.5',
                        rate: 'Good',
                        votes: '97'
                    }
                }

                persist.addToFavourites(restaurant).then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username/restaurant must be provided')
                    done()
                })
            })

            it('should error if no restaurant provided', done => {
                persist.addToFavourites('jdoe').then(response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username/restaurant must be provided')
                    done()
                })
            })

            it('should add to favourites', done => {
                 const restaurant = {
                    name: 'Akbars',
                    location: {
                        address: '7 Butts, West Midlands, UK CV1 3',
                        locality: 'Coventry',
                        city: 'West Midlands',
                        city_id: 330,
                        latitude: '52.4046430000',
                        longitude: '-1.5214160000',
                        zipcode: 'CV1 3',
                        country_id: 215
                    },
                    cuisines: 'Indian',
                    rating: {
                        value: '3.5',
                        rate: 'Good',
                        votes: '97'
                    }
                }

                persist.addToFavourites('jdoe', restaurant).then( response => {
                    expect(response.name).toBe('Akbars')
                    expect(response.rating.value).toBe('3.5')
                    schema.Restaurant.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(2)
                        done()
                    })
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })
        })

        describe('deleteFavourite', () => {
            it('should fail if no params provided', done => {
                persist.deleteFavourite().then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username/restaurantId must be provided')
                    done()
                }) 
            })

            it('should fail if no user provided', done => {
                persist.deleteFavourite(restaurantId).then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username/restaurantId must be provided')
                    done()
                })
            })

            it('should fail if no restaurantId provided', done => {
                persist.deleteFavourite('jdoe').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username/restaurantId must be provided')
                    done()
                })
            })

            it('should delete from favourites', done => {
                persist.deleteFavourite('jdoe', restaurantId).then( response => {
                    //expect(response).toBe(`${restaurantId} has been deleted successfully`)
                    schema.Restaurant.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(0)
                        done()
                    })
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })

            it('should not find any to delete for user', done => {
                persist.deleteFavourite('mkasz', restaurantId).then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe(`${restaurantId} cannot be found in users favourites`)
                    done()
                })
            })
        })

        describe('deleteFavourites', () => {
            it('should error if no user provided', done => {
                persist.deleteFavourites().then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('user must be provided')
                    done()
                })
            })

            it('should error if user does not have favourites', done => {
                persist.deleteFavourites('mkasz').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('mkasz does not have any favourites')
                    done()
                })
            })

            it('should delete all users favourites', done => {
                persist.deleteFavourites('jdoe').then( response => {
                    schema.Restaurant.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(0)
                        done()
                    })
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })
        })

        describe('updateFavourite', () => {})

        describe('getFavourites', () => {})
    })
    
})

