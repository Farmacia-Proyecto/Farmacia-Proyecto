import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { ProductsLot } from "./productlot.entity"
import { ProductsSupplier } from "src/suppliers/productssupplier.entity"
import { OrderDetails } from "src/purchaseorder/orderdetails.entity"
import { DetailsInvoice } from "src/invoice/detailsinvoice.entity"

@Entity()
export class Product{

    @PrimaryColumn()
    codProduct:number
    @Column()
    nameProduct:string
    @Column({nullable:true})
    describe:string
    @Column()
    unitOfMeasures:string

    @OneToMany(()=>ProductsLot,productLot=>productLot.product,{eager:true})
    productsLot:ProductsLot[]

    @OneToMany(()=>DetailsInvoice,detailsInvoice=>detailsInvoice.product,{eager:true})
    detailsInvoice:DetailsInvoice[]

    @OneToMany(()=>ProductsSupplier,productsSupplier=>productsSupplier.product,{eager:true})
    products:Product[]

    @OneToMany(()=>OrderDetails,orderDetails=>orderDetails.purchaseOrder,{eager:true})
    ordersDetails:OrderDetails[]
    
}