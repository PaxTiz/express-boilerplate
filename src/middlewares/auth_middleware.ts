import { body } from 'express-validator'
import { isAuth, validate } from './middleware'

export default {
    login: [body('username').isString().trim(), body('password').isString().trim(), validate],

    create: [
        body('username').isString().isLength({ min: 4, max: 20 }).trim(),
        body('email').isEmail().trim(),
        body('password').isString().isLength({ min: 8 }).trim(),
        validate,
    ],

    me: [isAuth],
}
