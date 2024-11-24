import { DetailsInvoice } from "src/detailsinvoice/detailsinvoice.entity";
import { Person } from "src/person/person.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";

@Entity()
export class Invoice{

    @PrimaryColumn()
    codInvoice:number
    @Column()
    date:Date
    @Column()
    documentClient:number
    @Column()
    typePayment:string
    @Column()
    totalPay:number
    @Column()
    subTotal:number
    @Column()
    iva:number
    @ManyToOne(()=> Person, person=>person.document,{eager:true})
    @JoinColumn({name:"documentPerson"})
    person:Person
    @OneToMany(()=>DetailsInvoice,detailsInvoice=>detailsInvoice.invoice)
    detailsInvoice:DetailsInvoice[]

    
}