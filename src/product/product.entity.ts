import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { ProductsLot } from "../productsLot/productlot.entity"
import { OrderDetails } from "src/purchaseorder/orderdetails.entity"
import { DetailsInvoice } from "src/invoice/detailsinvoice.entity"
import { Laboratory } from "src/laboratory/laboratory.entity"

@Entity()
export class Product{

    @PrimaryColumn()
    codProduct:number
    @Column()
    nameProduct:string
    @Column()
    describeProduct:string
    @Column()
    price:number

    @OneToMany(()=>ProductsLot,productLot=>productLot.product)
    productsLot:ProductsLot[]

    @OneToMany(()=>DetailsInvoice,detailsInvoice=>detailsInvoice.product)
    detailsInvoice:DetailsInvoice[]

    @ManyToOne(()=>Laboratory,laboratory=>laboratory.nit)
    @JoinColumn({name:"nit"})
    laboratory:Laboratory

    @OneToMany(()=>OrderDetails,orderDetails=>orderDetails.purchaseOrder)
    ordersDetails:OrderDetails[]
}