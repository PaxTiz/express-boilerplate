import { expect } from 'chai'
import client from '../../src/client'
import request from '../utils/request'

const unknownId = '239EC6B2-D9C8-4671-875C-6CDBB413396B'
const wrongLanguage = {
    name: 'dummy language',
    code: 'AAA',
}
const validLanguage = {
    id: null,
    name: 'valid dummy language',
    code: 'VDL',
}

const isLanguage = (object: unknown) =>
    expect(object).to.be.a('object').to.have.keys('id', 'name', 'code')

before(async () => {
    const wrongLanguageQuery = await client.languages.findFirst({
        where: { code: wrongLanguage.code },
    })
    if (!wrongLanguageQuery) {
        await client.languages.create({
            data: wrongLanguage,
        })
    }

    const validLanguageQuery = await client.languages.findFirst({
        where: { code: validLanguage.code },
    })
    if (validLanguageQuery) {
        await client.languages.delete({
            where: { id: validLanguageQuery.id },
        })
    }
})

describe('Languages endpoints', () => {
    describe('GET /languages', () => {
        it('should get all languages', () => {
            return request('get', '/languages').then(({ data }) => {
                expect(Array.isArray(data)).equal(true)
                for (const item of data) {
                    isLanguage(item)
                }
            })
        })

        it('should limit result count', () => {
            return request('get', '/languages?limit=10').then(({ data }) => {
                expect(Array.isArray(data)).equal(true)
                expect(data.length).lessThanOrEqual(10)
            })
        })

        it('should filter on name', () => {
            return request('get', '/languages?q=ab').then(({ data }) => {
                expect(Array.isArray(data)).equal(true)
                const count = data.filter((e: { name: string }) => e.name.includes('ab')).length
                expect(count).equal(
                    data.length,
                    'filter on query returns values that does not match given query',
                )
            })
        })
    })

    describe('GET /languages/:id', () => {
        it('should get language by an id', async () => {
            const languages = await request('get', '/languages?limit=5').then((res) => res.data)
            for (const language of languages) {
                await request('get', `/languages/${language.id}`).then(({ data }) => {
                    isLanguage(data)
                    expect(data.id).equal(language.id)
                })
            }
        })

        it('should not get language with invalid id', () => {
            return request('get', '/languages/wrong-id').catch(({ data }) => {
                expect(data).to.be.a('object').to.have.property('errors')
                expect(Array.isArray(data.errors)).equal(true)
                expect(
                    data.errors.find(
                        (e: { param: string; msg: string }) =>
                            e.param === 'id' && e.msg === 'Invalid value',
                    ),
                ).to.be.a('object')
            })
        })

        it('should return a 404 if id does not exists', () => {
            return request('get', `/languages/${unknownId}`).catch(({ data, status }) => {
                expect(data).to.be.a('object').to.have.property('message', 'not_found')
                expect(status).equal(404)
            })
        })
    })

    describe('POST /languages', () => {
        it('should not create a language if no body is sent', () => {
            return request('post', '/languages').catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object').to.have.property('errors')
            })
        })

        it('should not create a language if no code is sent', () => {
            return request('post', '/languages', { name: 'dummy kanguage' }).catch(
                ({ data, status }) => {
                    expect(status).equal(400)
                    expect(data).to.be.a('object').to.have.property('errors')
                },
            )
        })

        it('should not create a language if no name is sent', () => {
            return request('post', '/languages', { code: 'abc' }).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object').to.have.property('errors')
            })
        })

        it('should not create a language if code have wrong format', () => {
            return request('post', '/languages', { name: 'dummy kanguage', code: '1ABC9' }).catch(
                ({ data, status }) => {
                    expect(status).equal(400)
                    expect(data).to.be.a('object').to.have.property('errors')
                },
            )
        })

        it('should not create a language if code already exists', () => {
            return request('post', '/languages', wrongLanguage).catch(({ data, status }) => {
                expect(status).equal(422)
                expect(data).to.be.a('object').to.have.property('errors')
            })
        })

        it('should create a language if body is valid', () => {
            return request('post', '/languages', validLanguage).then(({ data, status }) => {
                expect(status).equal(201)
                isLanguage(data)
                expect(data.name).equal(validLanguage.name)
                expect(data.code).equal(validLanguage.code)
                validLanguage.id = data.id
            })
        })
    })

    describe('PATCH /languages/:id', () => {
        it('should not update a language if no body is sent', () => {
            return request('patch', `/languages/${validLanguage.id}`).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object').to.have.property('errors')
            })
        })

        it('should not update a language if no code is sent', () => {
            return request('patch', `/languages/${validLanguage.id}`, {
                name: 'dummy kanguage',
            }).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object').to.have.property('errors')
            })
        })

        it('should not update a language if no name is sent', () => {
            return request('patch', `/languages/${validLanguage.id}`, { code: 'abc' }).catch(
                ({ data, status }) => {
                    expect(status).equal(400)
                    expect(data).to.be.a('object').to.have.property('errors')
                },
            )
        })

        it('should not update a language if code have wrong format', () => {
            return request('patch', `/languages/${validLanguage.id}`, {
                name: 'dummy kanguage',
                code: '1ABC9',
            }).catch(({ data, status }) => {
                expect(status).equal(400)
                expect(data).to.be.a('object').to.have.property('errors')
            })
        })

        it('should not update a language if id does not exists', () => {
            return request('patch', `/languages/${unknownId}`, {
                name: 'dummy kanguage',
                code: '1ABC9',
            }).catch(({ status }) => {
                expect(status).equal(404)
            })
        })

        it('should not update a language if code already exists', () => {
            return request('patch', `/languages/${validLanguage.id}`, {
                ...validLanguage,
                code: wrongLanguage.code,
            }).catch(({ data, status }) => {
                expect(status).equal(422)
                expect(data).to.be.a('object').to.have.property('errors')
                expect(data.errors[0].msg).equal('code_already_exists')
            })
        })

        it('should update a language if body is valid', () => {
            return request('patch', `/languages/${validLanguage.id}`, {
                ...validLanguage,
                name: 'Dummy Language Updated',
            }).then(({ data, status }) => {
                expect(status).equal(200)
                isLanguage(data)
                expect(data.name).equal('Dummy Language Updated')
                expect(data.code).equal(validLanguage.code)
            })
        })
    })

    describe('DELETE /languages/:id', () => {
        it('should not delete a language if id does not exists', () => {
            return request('delete', `/languages/${unknownId}`).catch(({ status }) => {
                expect(status).equal(404)
            })
        })

        it('should delete a language if is exists', () => {
            return request('delete', `/languages/${validLanguage.id}`, {
                ...validLanguage,
                name: 'Dummy Language Updated',
            }).then(({ data, status }) => {
                expect(status).equal(200)
                isLanguage(data)
                expect(data.name).equal('Dummy Language Updated')
                expect(data.code).equal(validLanguage.code)
            })
        })
    })
})
