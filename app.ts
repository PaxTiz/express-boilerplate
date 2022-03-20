import 'express-async-errors'
import { join } from 'path'
import Application from './src/application'

new Application({
    env: join(__dirname, '.env'),
}).start()
