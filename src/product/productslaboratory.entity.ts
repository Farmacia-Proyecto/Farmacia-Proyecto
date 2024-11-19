import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Laboratory } from "../laboratory/laboratory.entity";
import { Product } from "src/product/product.entity";

@Entity()
export class ProductsLaboratory{

    @PrimaryColumn()
    nit:number
    @PrimaryColumn()
    codProducto:number

    @Column()
    price:number

    @ManyToOne(()=>Laboratory,laboratory=>laboratory.nit)
    laboratory:Laboratory

    @ManyToOne(()=>Product,product=>product.codProduct)
    product:Product
}