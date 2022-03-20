import { user } from '@prisma/client'
import prisma, { UserWithRole } from '../client'
import roleService from './role_repository'

export interface UserCreateDTO {
    username: string
    password: string
    email: string
}

/**
 * Find if an entry exists or not
 *
 * @param column the column used to search
 * @param value the value to search in the column
 * @returns true is an entry is found for `value` in `column`
 */
const exists = async (column: string, value: unknown): Promise<boolean> => {
    const count = await prisma.user.count({
        where: { [column]: value },
    })
    return count > 0
}

/**
 * Returns a model with the `value` in `column`
 *
 * @param column the column used to search
 * @param value the value to search in the column
 * @returns the model is it's found, or null
 */
const findOneBy = async (column: string, value: unknown): Promise<user | null> => {
    return await prisma.user.findFirst({
        where: { [column]: value },
        include: { role: true },
    })
}

/**
 * Create a user in the database
 *
 * @param user object containing username, email and password's bcrypt hash
 * @returns the inserted user
 */
const create = async (user: UserCreateDTO): Promise<UserWithRole> => {
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
}

export default {
    exists,
    findOneBy,
    create,
}
