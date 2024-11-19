import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { ProductsLot } from "./productlot.entity"
import { ProductsLaboratory } from "src/product/productslaboratory.entity"
import { OrderDetails } from "src/purchaseorder/orderdetails.entity"
import { DetailsInvoice } from "src/invoice/detailsinvoice.entity"

@Entity()
export class Product{

    @PrimaryColumn()
    codProduct:number
    @Column()
    nameProduct:string
    @Column({nullable:true})
    describeProduct:string

    @OneToMany(()=>ProductsLot,productLot=>productLot.product,{eager:true})
    productsLot:ProductsLot[]

    @OneToMany(()=>DetailsInvoice,detailsInvoice=>detailsInvoice.product,{eager:true})
    detailsInvoice:DetailsInvoice[]

    @OneToMany(()=>ProductsLaboratory,productsLaboratory=>productsLaboratory.laboratory,{eager:true})
    productsLaboratory:ProductsLaboratory[]

    @OneToMany(()=>OrderDetails,orderDetails=>orderDetails.purchaseOrder,{eager:true})
    ordersDetails:OrderDetails[]
    
}