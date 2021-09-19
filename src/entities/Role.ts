import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export default class Role {

    @PrimaryGeneratedColumn('uuid')
    id!: String

    @Column()
    name!: String

    @Column()
    displayName!: String

    @OneToMany(() => User, (user: User) => user.id)
    users!: Array<User>

}
