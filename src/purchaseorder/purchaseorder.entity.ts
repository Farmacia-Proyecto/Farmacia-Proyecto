import { Lot } from "src/lot/lot.entity";
import { Person } from "src/person/person.entity";
import { Laboratory } from "src/laboratory/laboratory.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetails } from "./orderdetails.entity";

@Entity()
export class PurchaseOrder{

    @PrimaryGeneratedColumn()
    codOrder:number
    @Column()
    totalOrder:number
    @Column()
    orderDate:Date
    @ManyToOne(()=>Laboratory,laboratory=>laboratory.nit)
    laboratory:Laboratory
    @ManyToOne(()=>Person,person=>person.document)
    person:Person
    @OneToMany(()=>OrderDetails,orderdetails=>orderdetails.purchaseOrder)
    orderDetails:OrderDetails

}