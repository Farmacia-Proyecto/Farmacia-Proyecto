import { Laboratory } from "src/laboratory/laboratory.entity";
import { Supplier } from "src/suppliers/supliers.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({name:"suppliers_laboratories"})
export class LaboratorySuppliers{
    
    @PrimaryColumn()
    nit:number
    @PrimaryColumn()
    codLaboratory:number

    @ManyToOne(()=>Supplier,supplier=>supplier.nit)
    @JoinColumn({name:"nit"})
    supplier:Supplier

    @ManyToOne(()=>Laboratory,laboratory=>laboratory.codLaboratory)
    @JoinColumn({name:"codLaboratory"})
    laboratory:Laboratory
}