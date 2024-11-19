import { Lot } from "src/lot/lot.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductsLot{
    
    @PrimaryColumn()
    codProduct:number
    @PrimaryColumn()
    codLot:number

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