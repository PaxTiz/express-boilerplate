import { Router } from "express"
import AuthMiddleware from "../middlewares/auth_middleware"
import AuthController from "../controllers/auth_controller"

const controller = new AuthController()
const router = Router()
router.post('/login', AuthMiddleware.login, controller.login)
router.post('/register', AuthMiddleware.create, controller.create)

module.exports = router
