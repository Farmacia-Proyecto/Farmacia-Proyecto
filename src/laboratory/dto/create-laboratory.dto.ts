export class CreateLaboratoryDto{
    nit:number
    nameLaboratory:string
    phoneLaboratory:number
    emailLaboratory:string
}

export class UpdateLaboratoryDto{
    nameLaboratory?:string
    phoneLaboratory?:number
    emailLaboratory?:string
}