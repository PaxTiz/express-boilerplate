const isProduction = process.env.APP_ENV === 'production'

module.exports = {
    type: process.env.DB_TYPE ?? 'mariadb',
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ?? 3306,
    username: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "root",
    database: process.env.DB_DATABASE ?? "myamazingdb",
    logging: isProduction
        ? false
        : process.env.DB_LOGGING
            ? process.env.DB_LOGGING === "true"
            : false,
    synchronize: isProduction
        ? false
        : process.env.DB_SYNCHRONIZE
            ? process.env.DB_SYNCHRONIZE === "true"
            : false,
    cache: isProduction
        ? { "duration": process.env.DB_CACHE ?? 60000 }
        : false,
    entities: isProduction
        ? [ "./dist/src/entities/*.js" ]
        : [ "./src/entities/*.ts" ],
}
