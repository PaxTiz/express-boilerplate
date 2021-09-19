import UserService from "../services/users_service"
import { Request, Response } from "express";
import Controller from "./controller";
import { User } from "../entities/User";
import Utils from "../utils/crypt";

export default class AuthController extends Controller {

	login = async (req: Request, res: Response): Promise<Response> => {
		const invalid = { message: "Nom d'utilisateur ou mot de passe invalide" }
		const user = await UserService.findBy('username', req.body.username)
		if (!user) {
			return this.handleResult(res, invalid, 400)
		}

		const isValidPassword = await Utils.validateCrypt(req.body.password, user.password)
		if (!isValidPassword) {
			return this.handleResult(res, invalid, 400)
		}

		return this.handleResult(res, {
			user: user.toJSON(),
			token: Utils.jwt(user)
		})
	}

	create = async (req: Request, res: Response): Promise<Response> => {
		const user = new User()
		user.username = req.body.username
		user.password = await Utils.crypt(req.body.password)
		user.email = req.body.email

		return this.isValid(user)
			.then(async (entity) => {
				const inserted = await UserService.create(entity)
				return this.handleResult(res, {
					user: inserted.toJSON(),
					token: Utils.jwt(inserted)
				})
			})
			.catch(errors => {
				return this.handleResult(res, errors, 422)
			})
	}

}
