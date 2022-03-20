import { role } from '@prisma/client'
import prisma from '../client'

const findByName = async (name: string): Promise<role> => {
    return prisma.role.findFirst({
        where: { name },
        rejectOnNotFound: true,
    })
}

export default {
    findByName,
}
