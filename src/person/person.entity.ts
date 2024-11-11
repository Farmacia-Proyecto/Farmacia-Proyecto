import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn,OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Person{
    
    @PrimaryColumn({unique: true})
    document: number

    @Column()
    typeDocument: string

    @Column()
    namePerson: string

    @Column()
    lastNamePerson: string

    @Column('bigint')
    phone: number

    @Column()
    email: string

    @OneToOne(()=> User,{eager: true})
    @JoinColumn({name:"userName"})
    user:User
}