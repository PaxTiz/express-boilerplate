import { user as User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { query, validationResult } from 'express-validator'
import { Unauthenticated } from '../controllers/controller'
import userRepository from '../repositories/user_repository'
import Utils from '../utils/crypto'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user: User
            auth: boolean
        }
    }
}

/**
 * Validate the request by checking if all values
 * from the query, the body and the parameters
 * are matching rules
 */
export function validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next()
}

/**
 * Deny access if no Authorization header is present
 * or JWT token is not valid
 */
export async function isAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.get('authorization')
    if (!header) {
        return Unauthenticated(res)
    }

    const token = header.split(' ')[1].trim()
    const user = Utils.decodeJWT(token) as { id: number }
    if (!user) {
        return Unauthenticated(res)
    }

    const fromDb = await userRepository.findOneBy('id', user.id)
    if (!fromDb) {
        return Unauthenticated(res)
    }
    req.user = fromDb
    req.auth = true
    return next()
}

export const applyCommonFilters = [
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
]
