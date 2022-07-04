/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai'
import prisma from '../../src/client'
import request from '../utils/request'

const username = 'Test User'
const email = 'test@test.com'
const password = 'testuser123'

before(async () => {
    const user = await prisma.user.findFirst({ where: { email, username } })
    if (user) {
        await prisma.user.delete({
            where: { id: user.id },
        })
    }
})

describe('Authentication endpoints', () => {
    describe('Register', () => {
        it('should fail register if no body is sent', async () => {
            return request('post', '/auth/register', {}).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object')
                expect(data).to.has.property('errors')
                expect(data.errors).to.be.a('array')
                expect(data.errors).length(5)

                expect(data.errors[0].msg).to.be.a('string')
                expect(data.errors[0].param).to.be.equal('username')
                expect(data.errors[0].msg).to.be.equal('Invalid value')

                expect(data.errors[1].msg).to.be.a('string')
                expect(data.errors[1].param).to.be.equal('username')
                expect(data.errors[1].msg).to.be.equal('Invalid value')

                expect(data.errors[2].msg).to.be.a('string')
                expect(data.errors[2].param).to.be.equal('email')
                expect(data.errors[2].msg).to.be.equal('Invalid value')

                expect(data.errors[3].msg).to.be.a('string')
                expect(data.errors[3].param).to.be.equal('password')
                expect(data.errors[3].msg).to.be.equal('Invalid value')

                expect(data.errors[4].msg).to.be.a('string')
                expect(data.errors[4].param).to.be.equal('password')
                expect(data.errors[4].msg).to.be.equal('Invalid value')
            })
        })

        it('should fail register if no username is sent', async () => {
            return request('post', '/auth/register', {
                email,
                password,
            }).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object')
                expect(data).to.has.property('errors')
                expect(data.errors).to.be.a('array')
                expect(data.errors).length(2)

                expect(data.errors[0].msg).to.be.a('string')
                expect(data.errors[0].param).to.be.equal('username')
                expect(data.errors[0].msg).to.be.equal('Invalid value')

                expect(data.errors[1].msg).to.be.a('string')
                expect(data.errors[1].param).to.be.equal('username')
                expect(data.errors[1].msg).to.be.equal('Invalid value')
            })
        })

        it('should fail register if no email is sent', async () => {
            return request('post', '/auth/register', {
                username,
                password,
            }).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object')
                expect(data).to.has.property('errors')
                expect(data.errors).to.be.a('array')
                expect(data.errors).length(1)

                expect(data.errors[0].msg).to.be.a('string')
                expect(data.errors[0].param).to.be.equal('email')
                expect(data.errors[0].msg).to.be.equal('Invalid value')
            })
        })

        it('should fail register if no username is sent', async () => {
            return request('post', '/auth/register', {
                email,
                password,
            }).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object')
                expect(data).to.has.property('errors')
                expect(data.errors).to.be.a('array')
                expect(data.errors).length(2)

                expect(data.errors[0].msg).to.be.a('string')
                expect(data.errors[0].param).to.be.equal('username')
                expect(data.errors[0].msg).to.be.equal('Invalid value')

                expect(data.errors[1].msg).to.be.a('string')
                expect(data.errors[1].param).to.be.equal('username')
                expect(data.errors[1].msg).to.be.equal('Invalid value')
            })
        })

        it('should fail register if password is too small', async () => {
            return request('post', '/auth/register', {
                username,
                email,
                password: 'a',
            }).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object')
                expect(data).to.has.property('errors')
                expect(data.errors).to.be.a('array')
                expect(data.errors).length(1)

                expect(data.errors[0].msg).to.be.a('string')
                expect(data.errors[0].param).to.be.equal('password')
                expect(data.errors[0].msg).to.be.equal('Invalid value')
            })
        })

        it('should fail register if email is not a valid address', async () => {
            return request('post', '/auth/register', {
                username,
                email: 'abcd',
                password,
            }).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object')
                expect(data).to.has.property('errors')
                expect(data.errors).to.be.a('array')
                expect(data.errors).length(1)

                expect(data.errors[0].msg).to.be.a('string')
                expect(data.errors[0].param).to.be.equal('email')
                expect(data.errors[0].msg).to.be.equal('Invalid value')
            })
        })

        it('should register if valid body is sent', async () => {
            return request('post', '/auth/register', {
                username,
                email,
                password,
            }).then(({ data, status }) => {
                expect(data.token).to.be.a('string')
                expect(data.user).to.be.a('object')
                expect(status).to.be.equal(201)
            })
        })

        it('should fail register if username is already in use', async () => {
            return request('post', '/auth/register', {
                username,
                email,
                password,
            }).catch(({ data, status }) => {
                expect(status).equal(422)
                expect(data).to.be.a('object')
                expect(data.errors).to.be.a('array')
                expect(data.errors).length(2)
                expect(data.errors[0].param).to.be.equal('username')
                expect(data.errors[0].msg).to.be.equal('username_already_in_use')
                expect(data.errors[1].param).to.be.equal('email')
                expect(data.errors[1].msg).to.be.equal('email_already_in_use')
            })
        })
    })

    describe('Login', () => {
        it('should fail login if no username and password are sent', async () => {
            return request('post', '/auth/login', {}).catch((err) => {
                expect(err).to.be.a('object')
                expect(err.errors).to.be.a('array')
                expect(err.errors[0].param).to.be.equal('username')
                expect(err.errors[0].msg).to.be.equal('Invalid value')
                expect(err.errors[1].param).to.be.equal('password')
                expect(err.errors[1].msg).to.be.equal('Invalid value')
            })
        })

        it('should fail login if no username is sent', async () => {
            return request('post', '/auth/login', { password }).catch((err) => {
                expect(err).to.be.a('object')
                expect(err.errors).to.be.a('array')
                expect(err.errors[0].param).to.be.equal('username')
                expect(err.errors[0].msg).to.be.equal('Invalid value')
            })
        })

        it('should fail login if no password is sent', async () => {
            return request('post', '/auth/login', { username }).catch((err) => {
                expect(err).to.be.a('object')
                expect(err.errors).to.be.a('array')
                expect(err.errors[0].param).to.be.equal('password')
                expect(err.errors[0].msg).to.be.equal('Invalid value')
            })
        })

        it('should fail login if password is incorrect', async () => {
            return request('post', '/auth/login', { username, password: 'abde' }).catch((err) => {
                expect(err.errors).to.be.a('array')
                expect(err.errors).to.be.length(1)
                err.errors.forEach((e: { param: any; msg: any }) => {
                    expect(e).to.be.a('object')
                    expect(e.param).to.be.equal('password')
                    expect(e.msg).to.be.equal('password_not_match')
                })
            })
        })

        it('should login with success', async () => {
            return request('post', '/auth/login', { username, password }).then(
                ({ data, status }) => {
                    expect(data.token).to.be.a('string')
                    expect(data.user).to.be.a('object')
                    expect(status).to.be.equal(200)
                },
            )
        })
    })
})
