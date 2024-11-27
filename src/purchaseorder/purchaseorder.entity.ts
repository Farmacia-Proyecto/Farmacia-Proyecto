import { Person } from "src/person/person.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetails } from "./orderdetails.entity";
import { Supplier } from "src/suppliers/supliers.entity";

@Entity()
export class PurchaseOrder{

    @PrimaryColumn()
    codOrder:number
    @Column()
    totalOrder:number
    @Column()
    orderDate:Date
    @ManyToOne(()=>Supplier,supplier=>supplier.nit)
    supplier:Supplier
    @ManyToOne(()=>Person,person=>person.document)
    person:Person
    @OneToMany(()=>OrderDetails,orderdetails=>orderdetails.purchaseOrder)
    orderDetails:OrderDetails

}