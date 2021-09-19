import { validationResult } from "express-validator"
import { NextFunction, Request, Response } from "express"
import Utils from "../utils/crypt"
import { User } from "../entities/User"

declare global {
    namespace Express {
        interface Request {
            user: User,
            auth: Boolean
        }
    }
}

export function validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next()
}

export async function isAuth(req: Request, res: Response, next: NextFunction) {
    const error = { message: 'Unauthorized' }
    const header = req.get('authorization')
    if (!header) {
        return res.status(401).json(error)
    }

    const token = header.split(' ')[1].trim()
    const user = Utils.decodeJWT(token)
    if (!user) {
        return res.status(401).json(error)
    }

    req.user = User.fromJSON(user)
    req.auth = true
    return next()
}
