export class CreateLaboratoryDto{
    nameLaboratory:string
}

export class UpdateLaboratoryDto{
    nameLaboratory?:string
    phoneLaboratory?:number
    emailLaboratory?:string
}

export class SearchLaboratory{
    nameLaboratory:string
}