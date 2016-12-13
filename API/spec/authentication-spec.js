
'use strict'

const auth = require('../modules/authentication')

describe('Authentication', () => {
    describe('getCredentials', () => {
        it('should error on header missing', done => {
            const request = {}

            auth.getCredentials(request).then( response => {
                expect(true).toBe(false)
                done()
            }).catch( err => {
                expect(err.message).toBe('authorization header missing')
                done()
            })
        })

        it('should error on different auth type', done => {
            const request = {
                authorization: {}
            }

            auth.getCredentials(request).then( response => {
                expect(true).toBe(false)
                done()
            }).catch( err => {
                expect(err.message).toBe('authorization header missing')
                done()
            })
        })

        it('should error on missing username', done => {
            const request = {
                authorization: {
                    basic: {
                        password: 't3stpass'
                    }
                }
            }

            auth.getCredentials(request).then( response => {
                expect(true).toBe(false)
                done()
            }).catch( err => {
                expect(err.message).toBe('username/password must be provided')
                done()
            })
        })

        it('should error on missing password', done => {
            const request = {
                authorization: {
                    basic: {
                        username: 'jdoe'
                    }
                }
            }

            auth.getCredentials(request).then( response => {
                expect(true).toBe(false)
                done()
            }).catch( err => {
                expect(err.message).toBe('username/password must be provided')
                done()
            })
        })

        it('should return authentication credentials', done => {
            const request = {
                authorization: {
                    basic: {
                        username: 'jdoe',
                        password: 't3stpass'
                    }
                }
            }

            auth.getCredentials(request).then( response => {
                expect(response.username).toBe('jdoe')
                expect(response.password).toBe('t3stpass')
                done()
            }).catch( err => {
                expect(true).toBe(false)
                done()
            })
        })
    })

    describe('hashPassword', () => {
        it('should error on missing password', done => {
            auth.hashPassword().then( response => {
                expect(true).toBe(false)
                done()
            }).catch( err => {
                expect(err.message).toBe('password must be provided')
                done()
            })
        })

        it('should hash the password', done => {
            auth.hashPassword('t3stpass').then( response => {
                expect(response.password).not.toBe('t3stpass')
                done()
            }).catch( err => {
                expect(true).toBe(false)
                done()
            })
        })
    })

    describe('verifyPassword', () => {
        it('should error on no password provided', done => {
            const provided = ''
            const stored = ''

            auth.verifyPassword(stored).then( response => {
                expect(true).toBe(false)
                done()
            }).catch( err => {
                expect(err.message).toBe('password provided/stored missing')
                done()
            })
        })

        it('should error on no password stored', done => {
            const provided = 't3stpass'

            auth.verifyPassword(provided).then( response => {
                expect(true).toBe(false)
                done()
            }).catch( err => {
                expect(err.message).toBe('password provided/stored missing')
                done()
            })
        })

        it('should verify the password', done => {
            const provided = 't3stpass'
            const stored = '$2a$10$71vGxYSrNI0QLRYQMYnkXO36mYOH98Deb1oA69ToK5kv1ww7USwoS'

            auth.verifyPassword(provided, stored).then( response => {
                expect(true).toBe(true)
                done()
            }).catch( err => {
                expect(true).toBe(false)
                done()
            })
        })

        it('should fail to verify the password', done => {
            const provided = 't3stpass'
            const stored = 'ddsginfowmdsbngfgd'

            auth.verifyPassword(provided, stored).then( response => {
                expect(true).toBe(false)
                done()
            }).catch( err => {
                expect(err.message).toBe('invalid password')
                done()
            })
        })
    })
})