import { Product } from "src/product/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PurchaseOrder } from "./purchaseorder.entity";

@Entity()
export class OrderDetails{

    @PrimaryColumn()
    codProduct:number
    @PrimaryColumn()
    codOrder:number

    @Column()
    quantity:number
    @Column()
    price:number
    @ManyToOne(()=>Product,product=>product.codProduct)
    @JoinColumn({name:"codProduct"})
    product:Product
    @ManyToOne(()=>PurchaseOrder,purchaseOrder=>purchaseOrder.codOrder)
    @JoinColumn({name:"codOrder"})
    purchaseOrder:PurchaseOrder


}