import { Express, Router } from 'express'
import controller from '../controllers/auth_controller'
import middleware from '../middlewares/auth_middleware'

module.exports = (app: Express) => {
    const router = Router()
    app.use('/auth', router)

    router.get('/me', middleware.me, controller.me)

    router.post('/login', middleware.login, controller.login)
    router.post('/register', middleware.create, controller.create)
}
