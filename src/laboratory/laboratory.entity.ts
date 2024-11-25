import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm"
import { Product } from "src/product/product.entity"
import { Supplier } from "src/suppliers/supliers.entity"
import { LaboratorySuppliers } from "src/laboratorysuppliers/laboratorysuppliers.entity"

@Entity()
export class Laboratory{
    
    @PrimaryColumn()
    codLaboratory:number
    @Column()
    nameLaboratory:string
    @OneToMany(()=>Product,product=>product.codProduct)
    products:Product[]
    @OneToMany(()=>LaboratorySuppliers,laboratorySuppliers=>laboratorySuppliers.laboratory)
    laboratorySuppliers:LaboratorySuppliers[];
}
