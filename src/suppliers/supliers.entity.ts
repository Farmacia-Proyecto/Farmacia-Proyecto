import { LaboratorySuppliers } from "src/laboratorysuppliers/laboratorysuppliers.entity"
import { ProductsSupplier } from "src/productssupplier/productssupplier.entity"
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"

@Entity()
export class Supplier {
    @PrimaryColumn()
    nit:number
    @Column()
    nameSupplier:string
    @Column()
    phoneSupplier:number
    @Column() 
    emailSupplier:string

    @OneToMany(()=>LaboratorySuppliers,laboratorySuppliers=>laboratorySuppliers.supplier)
    laboratories:LaboratorySuppliers[]

    @OneToMany(()=>ProductsSupplier,productsSupplier=>productsSupplier.supplier)
    products:ProductsSupplier[]
}