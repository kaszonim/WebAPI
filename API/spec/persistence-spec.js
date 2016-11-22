'use strict'

var persist = require("../modules/persistence")

describe('API data persistence', function () {

    it('createUser - invalid user object', (done) => {
        const details = {
            'password': '',
            'name': 'test name'
        }
        persist.createUser(details).catch( err => {
            expect(err.message).toBe('invalid user object')
            done()
        })
    })
})