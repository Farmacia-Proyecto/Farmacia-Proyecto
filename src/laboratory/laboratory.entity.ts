import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { PurchaseOrder } from "src/purchaseorder/purchaseorder.entity"
import { Product } from "src/product/product.entity"

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
    @OneToMany(()=>Product,product=>product.codProduct)
    products:Product[]
    @OneToMany(()=>PurchaseOrder,purchaseOrder=>purchaseOrder.codOrder)
    purchaseOrder:PurchaseOrder[]
}
