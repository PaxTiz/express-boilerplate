import 'reflect-metadata'
import fs from 'fs'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import { createConnection } from 'typeorm'
import dotenv from 'dotenv'
import Logger from './src/utils/logger'

dotenv.config()

const app = express()

createConnection().then(() => {
    app.use(helmet())
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json());
    app.use(morgan('combined'))
    app.use(cors())
    app.use(compression())

    fs.readdirSync('./src/routers').forEach((file) => {
        const filename = file.split('.')[0]
        const routerIndex = filename.indexOf('_router')
        const routeName = filename.slice(0, routerIndex)
        const path = routeName.replaceAll('_', '-')
        Logger.info(`Mount route '${path}' with router '${filename}'`)
        app.use(`/${path}`, require(`./src/routers/${filename}`))
    })

    app.get('*', (req: Request, res: Response) => {
        res.status(404).json({ message: 'Page not found' })
    })

    app.listen(3000, () => {
        Logger.info('Started server on port 3000')
    })
})
