import { Column, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm"

export class Product{
    @PrimaryColumn()
    codProduct:number
    @Column()
    nameProduct:string
    @Column()
    describe:string
    @Column()
    unitOfMeasures:string

    
}