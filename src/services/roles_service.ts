import prisma from '../client'

export default {
    async findByName(name: string) {
        return prisma.role.findFirst({
            where: { name },
            rejectOnNotFound: true,
        })
    },
}
