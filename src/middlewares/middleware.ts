import { user as User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import fileUploadMiddleware from 'express-fileupload'
import { body, query, validationResult } from 'express-validator'
import { extname } from 'path'
import { Unauthenticated } from '../controllers/controller'
import userService from '../services/users_service'
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

    const fromDb = await userService.findOneBy('id', user.id)
    if (!fromDb) {
        return Unauthenticated(res)
    }
    req.user = fromDb
    req.auth = true
    return next()
}

type FileUploadOptions = {
    name: string
    extensions?: string | Array<string>
    required?: boolean
}
export const fileUpload = (limit: number | undefined = undefined) => {
    return fileUploadMiddleware({
        limits: { fileSize: limit },
        debug: process.env.ENABLE_FILE_UPLOAD_LOGS === 'true',
        responseOnLimit: 'file_too_big',
    })
}

export const file = (options: FileUploadOptions) => {
    const required = options.required === undefined ? true : options.required
    return body(`files.${options.name}`).custom((value, { req }) => {
        const exists = req.files && req.files[options.name]
        if (!exists && required) {
            throw Error('required_file')
        }
        if (exists && options.extensions) {
            const extensionsArray = Array.isArray(options.extensions)
                ? options.extensions
                : [options.extensions]
            const extensions = extensionsArray.map((e) => `.${e}`)
            if (!extensions.includes(extname(req.files[options.name].name))) {
                throw Error('invalid_extension')
            }
        }

        return true
    })
}

export const applyCommonFilters = [
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
]
