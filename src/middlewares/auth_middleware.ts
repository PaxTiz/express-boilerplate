import { body } from "express-validator"
import { validate } from "./middleware"
import UserService from "../services/users_service"

export default class AuthMiddleware {

	static login = [
		body('username').isString(),
		body('password').isString(),
		validate
	]

	static create = [
		body('username').isString().custom(async (value: string) => {
			const user = await UserService.findBy('username', value)
			if (user) return Promise.reject("Le nom d'utilisateur est déjà utilisé")
		}),
		body('email').isEmail().custom(async (value: string) => {
			const user = await UserService.findBy('email', value)
			if (user) return Promise.reject("L'adresse email est déjà utilisée")
		}),
		body('password').isString().isLength({ min: 8 }),
		validate
	]

}
