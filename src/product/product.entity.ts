import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { ProductsLot } from "../productsLot/productlot.entity"
import { OrderDetails } from "src/orderdetails/orderdetails.entity"
import { DetailsInvoice } from "src/detailsinvoice/detailsinvoice.entity"
import { Laboratory } from "src/laboratory/laboratory.entity"
import { ProductsSupplier } from "src/productssupplier/productssupplier.entity"

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

    @ManyToOne(()=>Laboratory,laboratory=>laboratory.codLaboratory,{eager:true})
    @JoinColumn({name:"codLaboratory"})
    laboratory:Laboratory

    @OneToMany(()=>OrderDetails,orderDetails=>orderDetails.purchaseOrder)
    ordersDetails:OrderDetails[]

    @OneToMany(()=>ProductsSupplier,productsSupplier=>productsSupplier.product)
    productsSupplier:ProductsSupplier[]
}