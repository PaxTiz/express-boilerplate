import { getRepository } from "typeorm"
import { User } from "../entities/User"

export default class UserService {

	static async create(user: User): Promise<User> {
		return await getRepository(User).save(user)
	}

	static async findBy(field: string, value: any, includePassword: boolean = false): Promise<User | undefined> {
		return await getRepository(User)
			.createQueryBuilder()
			.addSelect(includePassword ? 'password' : '')
			.where({ [field]: value })
			.getOne()
	}

}
