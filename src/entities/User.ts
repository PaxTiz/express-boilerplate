import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { IsEmail, Length } from "class-validator"
import Role from "./Role"

@Entity()
export class User {

	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column()
	@Length(5, 20, { message: 'Le nom d\'utilisateur doit faire entre 5 et 20 caractères' })
	username!: string

	@Column()
	@Length(60, 60, { message: "Le mot de passe n'est pas valide" })
	// Min length of 60 is for bcrypt hash
	password!: string

	@Column()
	@IsEmail({}, { message: "L'adresse email n'est pas valide" })
	email!: string

	@ManyToOne(() => Role, (role) => role.users)
	role!: Role

	hasRole(role: string | Array<String>) {
		if (typeof role === 'string') {
			return this.role.name === role
		}

		return role.includes(this.role.name)
	}

	isAdmin() {
		return this.hasRole('admin')
	}

	toJSON(): Object {
		return {
			id: this.id,
			username: this.username,
			email: this.email
		}
	}

	/** Used for deserialize user from JWT token */
	static fromJSON(json: any): User {
		const user = new User()
		user.id = json.id
		user.username = json.username
		user.email = json.email
		return user
	}

}
