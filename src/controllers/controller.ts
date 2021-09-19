import { Response } from "express";
import { validate } from "class-validator";

export default abstract class Controller {

	handleResult(res: Response, data: any, status: number = 200, custom: boolean = false): Response {
		if (status === 422 && !custom) {
			// Use to returns errors as same way as express-validator
			const errors = {
				errors: (data as Array<any>).map(e => ({
					param: e.property,
					msg: Object.values(e.constraints)[0]
				}))
			}
			return res.status(422).json(errors)
		}
		else if (data === undefined && !custom) {
			return res.status(404).json({ message: 'Entity not found' })
		} else {
			return res.status(status).json(data)
		}
	}

	/**
	 * Checks if an entity is valid or not
	 *
	 * @param entity Entity to validate
	 * @returns Promise<ValidationError[] | Entity>
	 */
	isValid<T extends object>(entity: T): Promise<T> {
		return new Promise(async (resolve, reject) => {
			const errors = await validate(entity)
			if (errors.length > 0) {
				reject(errors)
			} else {
				resolve(entity)
			}
		})
	}

}
