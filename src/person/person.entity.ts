import { Invoice } from "src/invoice/invoice.entity";
import { Lot } from "src/lot/lot.entity";
import { PurchaseOrder } from "src/purchaseorder/purchaseorder.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn,OneToMany,OneToOne, PrimaryColumn } from "typeorm";

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

    @OneToMany(()=> Invoice, invoice=>invoice.codInvoice)
    invoices:Invoice[]

    @OneToMany(()=> Lot, lot=>lot.codLot)
    lots:Lot[]

    @OneToMany(()=>PurchaseOrder,purchaseOrder=>purchaseOrder.codOrder)
    purchaseOrder:PurchaseOrder[]
}