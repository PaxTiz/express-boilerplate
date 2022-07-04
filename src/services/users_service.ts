import { user } from '@prisma/client'
import prisma, { UserWithRole } from '../client'
import roleService from './roles_service'

export interface UserInterface {
    username: string
    password: string
    email: string
}

export default {
    async exists(column: string, value: unknown): Promise<boolean> {
        const count = await prisma.user.count({
            where: { [column]: value },
        })
        return count > 0
    },

    async findOneBy(column: string, value: unknown): Promise<user | null> {
        return await prisma.user.findFirst({
            where: { [column]: value },
            include: { role: true },
        })
    },

    async create(user: UserInterface): Promise<UserWithRole> {
        const role = await roleService.findByName('default')
        return await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
                roleId: role.id,
            },
            include: { role: true },
        })
    },
}
