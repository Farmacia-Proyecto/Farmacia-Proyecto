export class CreateProduct{
    codProduct:number
    nameProduct:string
    describeProduct?:string
    expirationDate?:Date
    codLot:string
    quantity:number
    priceBuy:number
    priceSell:number
    laboratory:string
}

export class UpdateProduct{
    nameProduct?:string
    describe?:string
}