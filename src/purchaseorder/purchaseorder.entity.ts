import { Person } from "src/person/person.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Supplier } from "src/suppliers/supliers.entity";
import { OrderDetails } from "src/orderdetails/orderdetails.entity";

@Entity()
export class PurchaseOrder{

    @PrimaryColumn()
    codOrder:number
    @Column()
    totalOrder:number
    @Column()
    orderDate:Date
    @Column()
    state:string
    @ManyToOne(()=>Supplier,supplier=>supplier.nit)
    @JoinColumn({name:"nitSupplier"})
    supplier:Supplier
    @ManyToOne(()=>Person,person=>person.document)
    @JoinColumn({name:"documentPerson"})
    person:Person
    @OneToMany(()=>OrderDetails,orderdetails=>orderdetails.purchaseOrder,{eager:true})
    orderDetails:OrderDetails[]

}