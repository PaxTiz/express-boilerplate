import { body } from "express-validator"
import { validate } from "./middleware"

export default class AuthMiddleware {

	static login = [
		body('username').isString(),
		body('password').isString(),
		validate
	]

	static create = [
		body('username').isString(),
		body('email').isEmail(),
		body('password')
			.isString()
			.isLength({ min: 8 })
			.withMessage('Le mot de passe doit faire au moins 8 caractères'),
		validate
	]

}
