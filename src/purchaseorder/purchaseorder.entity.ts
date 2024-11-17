import { Lot } from "src/lot/lot.entity";
import { Person } from "src/person/person.entity";
import { Suppliers } from "src/suppliers/suppliers.entity";
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
    @ManyToOne(()=>Suppliers,supplier=>supplier.nit)
    supplier:Suppliers
    @ManyToOne(()=>Person,person=>person.document)
    person:Person
    @OneToMany(()=>OrderDetails,orderdetails=>orderdetails.purchaseOrder)
    orderDetails:OrderDetails

}