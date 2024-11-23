import { DetailsInvoice } from "src/invoice/detailsinvoice.entity";
import { Person } from "src/person/person.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invoice{

    @PrimaryGeneratedColumn()
    codInvoice:number
    @Column()
    date:Date
    @Column()
    documentClient:number
    @Column()
    typePayment:string
    @Column()
    totalPay:number
    @ManyToOne(()=> Person, person=>person.document)
    person:Person
    @OneToMany(()=>DetailsInvoice,detailsInvoice=>detailsInvoice.invoice)
    detailsInvoice:DetailsInvoice[]

    
}