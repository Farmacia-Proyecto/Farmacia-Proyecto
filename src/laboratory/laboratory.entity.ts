import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { ProductsLaboratory } from "../product/productslaboratory.entity"
import { PurchaseOrder } from "src/purchaseorder/purchaseorder.entity"

@Entity()
export class Laboratory{
    @PrimaryColumn()
    nit:number
    @Column()
    nameLaboratory:string
    @Column()
    phoneLaboratory:number
    @Column()
    emailLaboratory:string
    @OneToMany(()=>ProductsLaboratory,productLaboratory=>productLaboratory.laboratory)
    productsLaboratory:ProductsLaboratory[]
    @OneToMany(()=>PurchaseOrder,purchaseOrder=>purchaseOrder.codOrder)
    purchaseOrder:PurchaseOrder[]
}