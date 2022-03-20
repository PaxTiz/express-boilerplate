import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
    log: process.env.APP_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
})

export type UserWithRole = Prisma.userGetPayload<{
    include: { role: true }
}>

export default prisma
