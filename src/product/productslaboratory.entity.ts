import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Laboratory } from "../laboratory/laboratory.entity";
import { Product } from "src/product/product.entity";

@Entity()
export class ProductsLaboratory{

    @PrimaryColumn()
    nit:number
    @PrimaryColumn()
    codProduct:number

    @Column()
    price:number

    @ManyToOne(()=>Laboratory,laboratory=>laboratory.nit)
    @JoinColumn({name:"nit"})
    laboratory:Laboratory

    @ManyToOne(()=>Product,product=>product.codProduct)
    @JoinColumn({name:"codProduct"})
    product:Product
}