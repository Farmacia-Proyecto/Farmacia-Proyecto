import { Invoice } from "src/invoice/invoice.entity";
import { Product } from "src/product/product.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class DetailsInvoice{

    @PrimaryColumn()
    codInvoice:number
    @PrimaryColumn()
    codProduct:number

    @Column()
    quantity:number

    @Column()
    price:number

    @Column()
    iva:number

    @ManyToOne(()=>Invoice,invoice=>invoice.codInvoice,{eager:true})
    invoice:Invoice

    @ManyToOne(()=>Product,product=>product.codProduct,{eager:true})
    product:Product

}