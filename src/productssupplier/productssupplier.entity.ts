import { Product } from "src/product/product.entity";
import { Supplier } from "src/suppliers/supliers.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({name:"products_supplier"})
export class ProductsSupplier{
    
    @PrimaryColumn()
    nit:number
    @PrimaryColumn()
    codProduct:number

    @ManyToOne(()=>Supplier,supplier=>supplier.nit)
    @JoinColumn({name:"nit"})
    supplier:Supplier

    @ManyToOne(()=>Product,product=>product.codProduct)
    @JoinColumn({name:"codProduct"})
    product:Product

}