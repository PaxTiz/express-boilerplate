import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class Utils {

	static async crypt(value: string): Promise<string> {
		return bcrypt.hash(value, 10).then((hash: any) => hash)
	}

	static async validateCrypt(value: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(value, hash)
	}

	/** Default expiration time is set to 1 hour */
	static jwt(value: any, expiration: number = Math.floor(Date.now() / 1000) + (60 * 60)): string {
		return jwt.sign({
			exp: expiration,
			data: JSON.stringify(value)
		}, process.env.JWT_SECRET as string)
	}

	static decodeJWT(token: string): Object | null | void {
		return jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
			if (err) {
				return null
			}

			return JSON.parse(data!.data)
		})
	}

}
