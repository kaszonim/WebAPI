'use strict'

var persist = require("../modules/persistence")
var schema = require("../schema/test-schema")

describe('API data persistence', () => {
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
                done()
            })
        })

        it('should fail', done => {
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
        it('should return users', done => {
            persist.getUsers().then( response => {
                expect(response.length).toBe(1)
                done()
            }).catch( err => {
                expect(true).toBe(false)
                done()
            })
        })
            
        it('should fail', done => {
            persist.getUsers().then( response => {
                if (response) expect(true).toBe(false)
                done()
            }).catch( err => {
                //console.log(err)
                expect(err.message).toBe('no users found')
                done()
            })
        })
     })

     describe('deleteUsers', () => {
        it('should delete all users', done => {
            persist.deleteUsers().then( response => {
                expect(response).toBe('All users removed successfully')
                schema.User.count({}, (err, count) => {
					if (err) expect(true).toBe(false)
					expect(count).toBe(0)
					done()
				})
                done()
            }).catch( err => {
                if (err) expect(true).toBe(false)
                done()
            })
        })
     })
})