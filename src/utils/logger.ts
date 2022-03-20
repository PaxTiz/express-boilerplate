import { inspect } from 'util'

export default class Logger {
    static info(message: unknown) {
        console.info(`[INFO] - ${this._satanizeMessage(message)}`)
    }

    static error(message: unknown) {
        console.error(`[ERROR] - ${this._satanizeMessage(message)}`)
    }

    static debug(message: unknown) {
        if (process.env.APP_ENV === 'development') {
            console.log(`[DEBUG] - ${this._satanizeMessage(message)}`)
        }
    }

    private static _satanizeMessage(message: unknown): unknown {
        if (typeof message === 'object' || Array.isArray(message)) {
            return inspect(message)
        }
        return message
    }
}
