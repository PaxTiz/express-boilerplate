import { PrismaClient } from '.prisma/client'
import Logger from '../src/utils/logger'

const client = new PrismaClient()

const truncate = async () => {
    Logger.info('Delete users')
    await client.user.deleteMany()
    Logger.info('Delete roles')
    await client.role.deleteMany()
}

const seed = async () => {
    return await truncate().then(async () => {
        Logger.info('Create roles')
        await client.role.create({
            data: {
                name: 'default',
                displayName: 'Member',
            },
        })
    })
}

const main = async () => {
    Logger.info('Start seeding')
    return seed().catch((e: Error) => e)
}

main()
    .then(() => {
        Logger.info('Database seeded successfully')
    })
    .catch((e) => {
        Logger.error('Failed to seed database because :')
        Logger.error(e)
    })
    .finally(() => {
        Logger.info('End seeding')
        client.$disconnect()
    })
