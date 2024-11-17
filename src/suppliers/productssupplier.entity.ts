import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Suppliers } from "./suppliers.entity";
import { Product } from "src/product/product.entity";

@Entity()
export class ProductsSupplier{

    @PrimaryColumn()
    nit:number
    @PrimaryColumn()
    codProducto:number

    @Column()
    price:number

    @ManyToOne(()=>Suppliers,suppliers=>suppliers.nit)
    supplier:Suppliers

    @ManyToOne(()=>Product,product=>product.codProduct)
    product:Product
}