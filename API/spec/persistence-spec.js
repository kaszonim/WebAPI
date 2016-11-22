'use strict'

var persist = require("../modules/persistence")

describe('API data persistence', function () {

    it('createUser - invalid user object', (done) => {
        const details = {
            'password': '',
            'name': 'test name'
        }

        persist.createUser(details).then( (response) => {
            expect(response).toBe(null)
            done()
        }).catch( err => {
            expect(err.message).toBe('invalid user object')
            done()
        })
    })

    it('createUser - success', (done) => {
        const details = {
            'username': 'testuser',
            'password': 't3stus3r',
            'name': 'Test User'
        }

        persist.createUser(details).then( (response) => {
            expect(response.username).toBe('testuser')
            expect(response.password).toBe(undefined)
            expect(response.name).toBe('Test User')
            done()
        })
    })

    xit('createUser - failure', (done) => {
        const details = {
            'username': 'testuser',
            'password': 't3stus3r',
            'name': 'Test User'
        }

        persist.createUser(details).then( (response) => {
            expect(response).toBe(null)
            done()
        }).catch( err => {
            expect(err.message).toBe('error creating account')
            done()
        })
    })

    it('getUsers - error', (done) => {
        persist.getUsers().then( (response) => {
            expect(response).toBe(null)
            done()
        }).catch( err => {
            //console.log(err)
            //expect(err.message).toBe('error getting ussers')
            done()
        })
    })

    it('deleteUsers - success', (done) => {
        persist.deleteUsers().then( (response) => {
            expect(response).toBe('All users removed successfully')
            done()
        }).catch( err => {
            expect(err).toBe(null)
            done()
        })
    })
})