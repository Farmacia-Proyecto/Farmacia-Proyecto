import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { ProductsSupplier } from "./productssupplier.entity"
import { PurchaseOrder } from "src/purchaseorder/purchaseorder.entity"

@Entity()
export class Suppliers{
    @PrimaryColumn()
    nit:number
    @Column()
    nameCompany:string
    @Column()
    phone:number
    @Column()
    emailCompany:string
    @OneToMany(()=>ProductsSupplier,productsSupplier=>productsSupplier.supplier)
    productsSuppliers:ProductsSupplier[]
    @OneToMany(()=>PurchaseOrder,purchaseOrder=>purchaseOrder.codOrder)
    purchaseOrder:PurchaseOrder[]
}