import { CreateLaboratoryDto } from "src/laboratory/dto/create-laboratory.dto"

export class CreateSupplierDto{
    nit:number
    nameSupplier:string
    phoneSupplier:number
    emailSupplier:string
    laboratories:CreateLaboratoryDto[]
}

export class updateSupplier{
    nameSupplier:string
    phoneSupplier:number
    emailSupplier:string
    laboratories:CreateLaboratoryDto[]
}

export class searchSupplier{
    nameSupplier:string
}