import { expect } from 'chai'
import request from './utils/request.mjs'

const username = 'Test User'
const email = 'test@test.com'
const password = 'testuser123'

describe('Authentication endpoints', () => {
    describe('Register', () => {
        it('should fail register if no body is sent', async () => {
            return request('post', '/auth/register', {})
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err).to.has.property('errors')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors).length(5)

                    expect(err.errors[0].msg).to.be.a('string')
                    expect(err.errors[0].param).to.be.equal('username')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')

                    expect(err.errors[1].msg).to.be.a('string')
                    expect(err.errors[1].param).to.be.equal('username')
                    expect(err.errors[1].msg).to.be.equal('Invalid value')

                    expect(err.errors[2].msg).to.be.a('string')
                    expect(err.errors[2].param).to.be.equal('email')
                    expect(err.errors[2].msg).to.be.equal('Invalid value')

                    expect(err.errors[3].msg).to.be.a('string')
                    expect(err.errors[3].param).to.be.equal('password')
                    expect(err.errors[3].msg).to.be.equal('Invalid value')

                    expect(err.errors[4].msg).to.be.a('string')
                    expect(err.errors[4].param).to.be.equal('password')
                    expect(err.errors[4].msg).to.be.equal('Invalid value')
                })
        })

        it('should fail register if no username is sent', async () => {
            return request('post', '/auth/register', {
                email,
                password,
            })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err).to.has.property('errors')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors).length(2)

                    expect(err.errors[0].msg).to.be.a('string')
                    expect(err.errors[0].param).to.be.equal('username')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')

                    expect(err.errors[1].msg).to.be.a('string')
                    expect(err.errors[1].param).to.be.equal('username')
                    expect(err.errors[1].msg).to.be.equal('Invalid value')
                })
        })

        it('should fail register if no email is sent', async () => {
            return request('post', '/auth/register', {
                username,
                password,
            })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err).to.has.property('errors')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors).length(1)

                    expect(err.errors[0].msg).to.be.a('string')
                    expect(err.errors[0].param).to.be.equal('email')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')
                })
        })

        it('should fail register if no username is sent', async () => {
            return request('post', '/auth/register', {
                email,
                password,
            })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err).to.has.property('errors')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors).length(2)

                    expect(err.errors[0].msg).to.be.a('string')
                    expect(err.errors[0].param).to.be.equal('username')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')

                    expect(err.errors[1].msg).to.be.a('string')
                    expect(err.errors[1].param).to.be.equal('username')
                    expect(err.errors[1].msg).to.be.equal('Invalid value')
                })
        })

        it('should fail register if password is too small', async () => {
            return request('post', '/auth/register', {
                username,
                email,
                password: 'a',
            })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err).to.has.property('errors')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors).length(1)

                    expect(err.errors[0].msg).to.be.a('string')
                    expect(err.errors[0].param).to.be.equal('password')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')
                })
        })

        it('should fail register if email is not a valid address', async () => {
            return request('post', '/auth/register', {
                username,
                email: 'abcd',
                password,
            })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err).to.has.property('errors')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors).length(1)

                    expect(err.errors[0].msg).to.be.a('string')
                    expect(err.errors[0].param).to.be.equal('email')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')
                })
        })

        it('should register if valid body is sent', async () => {
            return request('post', '/auth/register', {
                username,
                email,
                password,
            })
                .then((res) => {
                    expect(res.data.token).to.be.a('string')
                    expect(res.data.user).to.be.a('object')
                    expect(res.status).to.be.equal(201)
                })
                .catch((err) => {
                    expect(err).to.be.equal(undefined)
                })
        })

        it('should fail register if username is already in use', async () => {
            return request('post', '/auth/register', {
                username,
                email,
                password,
            })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors).length(2)
                    expect(err.errors[0].param).to.be.equal('username')
                    expect(err.errors[0].msg).to.be.equal('username_already_in_use')
                    expect(err.errors[1].param).to.be.equal('email')
                    expect(err.errors[1].msg).to.be.equal('email_already_in_use')
                })
        })
    })

    describe('Login', () => {
        it('should fail login if no username and password are sent', async () => {
            return request('post', '/auth/login', {})
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors[0].param).to.be.equal('username')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')
                    expect(err.errors[1].param).to.be.equal('password')
                    expect(err.errors[1].msg).to.be.equal('Invalid value')
                })
        })

        it('should fail login if no username is sent', async () => {
            return request('post', '/auth/login', { password })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors[0].param).to.be.equal('username')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')
                })
        })

        it('should fail login if no password is sent', async () => {
            return request('post', '/auth/login', { username })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err).to.be.a('object')
                    expect(err.errors).to.be.a('array')
                    expect(err.errors[0].param).to.be.equal('password')
                    expect(err.errors[0].msg).to.be.equal('Invalid value')
                })
        })

        it('should fail login if password is incorrect', async () => {
            return request('post', '/auth/login', { username, password: 'abde' })
                .then((res) => {
                    expect(res).to.be.equal(undefined)
                })
                .catch((err) => {
                    expect(err.errors).to.be.a('array')
                    expect(err.errors).to.be.length(1)
                    err.errors.forEach((e) => {
                        expect(e).to.be.a('object')
                        expect(e.param).to.be.equal('password')
                        expect(e.msg).to.be.equal('password_not_match')
                    })
                })
        })

        it('should login with success', async () => {
            return request('post', '/auth/login', { username, password })
                .then((res) => {
                    expect(res.data.token).to.be.a('string')
                    expect(res.data.user).to.be.a('object')
                    expect(res.status).to.be.equal(200)
                })
                .catch((err) => {
                    expect(err).to.be.equal('array')
                })
        })
    })
})
