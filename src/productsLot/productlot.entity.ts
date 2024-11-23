import { Lot } from "src/lot/lot.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import { Product } from "../product/product.entity";

@Entity('products_lot')
export class ProductsLot{
    
    @PrimaryColumn()
    codProduct:number

    @PrimaryColumn()
    codLot:string

    @Column()
    quantity:number

    @Column()
    expirationDate:Date

    @Column()
    price:number
    
    @Column()
    availability:boolean

    @ManyToOne(()=>Product,product=>product.codProduct)
    @JoinColumn({name:'codProduct'})
    product:Product

    @ManyToOne(()=>Lot,lot=>lot.codLot)
    @JoinColumn({name:'codLot'})
    lot:Lot
}