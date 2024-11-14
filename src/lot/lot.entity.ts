import { Person } from "src/person/person.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Lot{
    @PrimaryColumn()
    codLot:string

    @Column()
    registerDate:Date

    @ManyToMany(()=>Person, person=>person.document)
    person:Person
}