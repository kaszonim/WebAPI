'use strict'

var persist = require("../modules/persistence")

describe('API data persistence', function () {

    it('addAccount - invalid user object', (done) => {
        const details = {
            'password': '',
            'name': 'test name'
        }
        persist.addAccount(details).catch( err => {
            expect(err.message).toBe('invalid user object')
            done()
        })
    })
})