import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { ProductsLot } from "../productsLot/productlot.entity"
import { ProductsLaboratory } from "src/productsLaboratory/productlaboratory.entity"
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

    @OneToMany(()=>ProductsLot,productLot=>productLot.product)
    productsLot:ProductsLot[]

    @OneToMany(()=>DetailsInvoice,detailsInvoice=>detailsInvoice.product)
    detailsInvoice:DetailsInvoice[]

    @OneToMany(()=>ProductsLaboratory,productsLaboratory=>productsLaboratory.product)
    productsLaboratory:ProductsLaboratory[]

    @OneToMany(()=>OrderDetails,orderDetails=>orderDetails.purchaseOrder)
    ordersDetails:OrderDetails[]
}