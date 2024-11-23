import { Person } from "src/person/person.entity";
import { ProductsLot } from "src/productsLot/productlot.entity";
import { PurchaseOrder } from "src/purchaseorder/purchaseorder.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Lot{
    @PrimaryColumn()
    codLot:string

    @Column()
    registerDate:Date

    @ManyToOne(()=>Person, person=>person.document)
    @JoinColumn({name:"documentPerson"})
    person:Person

    @OneToMany(()=>ProductsLot,productsLot=>productsLot.lot)
    productsLot:ProductsLot[]

    @OneToOne(()=>PurchaseOrder)
    @JoinColumn({name:'codOrder'})
    purchaseOrder:PurchaseOrder
}