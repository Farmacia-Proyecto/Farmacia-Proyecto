import { Person } from "src/person/person.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";

@Entity()
export class User{
    
    @PrimaryColumn({unique: true})
    userName: string

    @Column()
    password: string

    @Column()
    typeUser: string

    @Column()
    state: boolean

}