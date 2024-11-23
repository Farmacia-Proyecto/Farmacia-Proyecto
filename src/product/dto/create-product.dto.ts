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
    nameProduct:string
    describeProduct:string
    laboratory:string
    priceSell:number
}

export class infoGetProduct{
    nameProduct:string
    laboratory:string
}

export class SearchProduct{
    nameProduct:string
}