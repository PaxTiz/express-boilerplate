export default class Logger {
    static info(message: any) {
        console.info(`[INFO] - ${message}`)
    }

    static error(message: any) {
        console.error(`[ERROR] - ${message}`)
    }

    static debug(message: any) {
        console.log(`[DEBUG] - ${message}`)
    }

}
