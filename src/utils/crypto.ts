import bcrypt from 'bcrypt'
import { assert } from 'console'
import jwt from 'jsonwebtoken'

export default class Utils {
    /**
     * Encrypt a value and returns it as bcrypt
     *
     * @param value the value to crypt
     * @returns the value crypted with bcrypt
     */
    static async bcrypt(value: string): Promise<string> {
        return bcrypt.hash(value, 10)
    }

    /**
     * Check if a string and a hash are equals or not
     *
     * @param value the plain value to check
     * @param hash the crypted string of the value
     * @returns true if value and hash are equals, or false
     */
    static async validateBcrypt(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash)
    }

    /**
     * Generate a JWT token
     *
     * @param value value to encode in the JWT
     * @param expiration expiration date of the token (default to 1 hour)
     * @returns the generated JWT token
     */
    static generateJWT(
        value: unknown,
        expiration: number = Math.floor(Date.now() / 1000) + 60 * 60,
    ): string {
        return jwt.sign(
            {
                exp: expiration,
                data: JSON.stringify(value),
            },
            process.env.JWT_SECRET as string,
        )
    }

    /**
     * Decode and parse data from a JWT token
     *
     * @param token the token to decode
     * @returns the data of the token if it's valid, or null
     */
    static decodeJWT(token: string): unknown {
        return jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
            if (err) {
                return null
            } else if (data === null) {
                throw Error()
            }

            assert(data)
            if (typeof data === 'string') {
                return JSON.parse(data)
            } else {
                return data
            }
        })
    }
}
