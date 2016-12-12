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

        describe('deleteUser', () => {
            it('should fail on missing username', done => {
                persist.deleteUser().then( response => {
                if (response) expect(true).toBe(false)
                done()
                }).catch( err => {
                    expect(err.message).toBe('username must be provided')
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

            it('should error if incorrect user', done => {
                persist.deleteUser('mkasz').then( response => {
                if (response) expect(true).toBe(false)
                done()
                }).catch( err => {
                    expect(err.message).toBe('mkasz cannot be deleted')
                    done()
                })
            })
        })

        describe('checkUserExists', () => {
            it('should error on missing username', done => {
                persist.checkUserExists().then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('missing username')
                    done()
                })
            })

            it('should find existing username', done => {
                persist.checkUserExists('jdoe').then( () => {
                    expect(true).toBe(true)
                    done()
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })

            it('should fail to find the username', done => {
                persist.checkUserExists('jdoe2').then( response => {
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
                    id: '16681615',
                    name: 'Cosmos',
                    location:  {
                        address: '36-42 Corporation St, Coventry, UK CV1 1',
                        locality: 'Coventry',
                        city: 'West Midlands',
                        postcode: 'CV1 1'
                    },
                    cuisines: 'Chinese, Italian',
                    table_booking: 'No',
                    average_cost: 12,
                    currency: '£',
                    rating: {
                        value: '3.9',
                        rate: 'Good',
                        votes: '290'
                    },
                    comments: 'Very nice place'
                }

                new schema.Restaurant(restaurant).save( (err, restaurant) => {
                    if (err) expect(true).toBe(false)
                    schema.Restaurant.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(1)
                        done()
                    })
                })
            })
        })

        describe('checkFavouriteExists', () => {
            it('should error on missing username', done => {
                persist.checkFavouriteExists('16681615').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username/restaurantId must be provided')
                    done()
                })
            })

            it('should error on missing restaurantId', done => {
                persist.checkFavouriteExists('jdoe').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username/restaurantId must be provided')
                    done()
                })
            })

            it('should error on existing restaurant', done => {
                persist.checkFavouriteExists('jdoe', '16681615').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('restaurant already exists in the favourites list')
                    done()
                })
            })

            it('should not find restaurant', done => {
                persist.checkFavouriteExists('jdoe', '16681617').then( () => {
                    expect(true).toBe(true)
                    done()
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })
        })

        describe('addToFavourites', () => {
            it('should error if no user provided', done => {
                const restaurant = {
                    id: '16680585',
                    name: 'Akbars',
                    location: {
                        address: '7 Butts, West Midlands, UK CV1 3',
                        locality: 'Coventry',
                        city: 'West Midlands',
                        postcode: 'CV1 3'
                    },
                    cuisines: 'Indian',
                    table_booking: 'No',
                    average_cost: 12,
                    currency: '£',
                    rating: {
                        value: '3.5',
                        rate: 'Good',
                        votes: '97'
                    },
                    comments: 'This looks nice, we should go there sometimes.'
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
                    id: '16680585',
                    name: 'Akbars',
                    location: {
                        address: '7 Butts, West Midlands, UK CV1 3',
                        locality: 'Coventry',
                        city: 'West Midlands',
                        postcode: 'CV1 3'
                    },
                    cuisines: 'Indian',
                    table_booking: 'No',
                    average_cost: 12,
                    currency: '£',
                    rating: {
                        value: '3.5',
                        rate: 'Good',
                        votes: '97'
                    },
                    comments: ''
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
                persist.deleteFavourite(16680585).then( response => {
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
                persist.deleteFavourite('jdoe', '16681615').then( response => {
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
                persist.deleteFavourite('mkasz', '16680585').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('16680585 cannot be found in users favourites')
                    done()
                })
            })
        })

        describe('deleteFavourites', () => {
            beforeEach( done => {
                const restaurant = {
                    username: 'jdoe',
                    id: '16682100',
                    name: 'Nandos',
                    location:  {
                        address: '36-42 Corporation St, Coventry, UK CV1 1',
                        locality: 'Coventry',
                        city: 'West Midlands',
                        postcode: 'CV1 1',
                    },
                    cuisines: 'Chiken, Grill',
                    table_booking: 'No',
                    average_cost: 12,
                    currency: '£',
                    rating: {
                        value: '3.9',
                        rate: 'Good',
                        votes: '290'
                    },
                    comments: ''
                }

                new schema.Restaurant(restaurant).save( (err, restaurant) => {
                    if (err) expect(true).toBe(false)
                    schema.Restaurant.count({}, (err, count) => {
                        if (err) expect(true).toBe(false)
                        expect(count).toBe(2)
                        done()
                    })
                })
            })


            it('should error if no user provided', done => {
                persist.deleteFavourites().then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username must be provided')
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

        describe('updateFavourite', () => {
            it('should error if no user provided', done => {
                persist.updateFavourite('16681615', 'comments').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username,comments and restaurant ID must be provided')
                    done()
                }) 
            })

            it('should error if no comments provided', done => {
                persist.updateFavourite('jdoe', '16681615').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username,comments and restaurant ID must be provided')
                    done()
                }) 
            })

            it('should error if no restaurantId provided', done => {
                persist.updateFavourite('jdoe', 'some comments').then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username,comments and restaurant ID must be provided')
                    done()
                }) 
            })

            it('should error if no params provided', done => {
                 persist.updateFavourite().then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username,comments and restaurant ID must be provided')
                    done()
                }) 
            })

            it('should error if restaurant not found for user', done => {
                persist.updateFavourite('mkasz', '16681615', 'I want to go back here').then( () => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('16681615 could not be found for user mkasz or the comment already exists')
                    done()
                })
            })

            it('should successfully update restaurant for user', done => {
                persist.updateFavourite('jdoe', '16681615', 'I want to go back here').then( () => {
                    schema.Restaurant.find({username: 'jdoe', id: '16681615'}, (err, restaurant) => {
                        if (err) expect(true).toBe(false)   
                        expect(restaurant[0].id).toBe('16681615')
                        expect(restaurant[0].comments).toBe('I want to go back here')
                        done()
                    })
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                })
            })
        })

        describe('getFavourites', () => {
            it('should error if no user provided', done => {
                persist.getFavourites().then( response => {
                    if (response) expect(true).toBe(false)
                    done()
                }).catch( err => {
                    expect(err.message).toBe('username must be provided')
                    done()
                }) 
            })

            it('should return message if favourites not found for user', done => {
                persist.getFavourites('mkasz').then( response => {
                    expect(response.message).toBe(`no favourites found for user mkasz`)
                    done()
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                }) 
            })

            it('should return successfully user favourites', done => {
                persist.getFavourites('jdoe').then( response => {
                    expect(response.total).toBe(1)
                    expect(response.restaurants[0].name).toBe('Cosmos')
                    done()
                }).catch( err => {
                    if (err) expect(true).toBe(false)
                    done()
                }) 
            })

        })
    })
})