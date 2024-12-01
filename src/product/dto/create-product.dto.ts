export class CreateProduct{
    codProduct:number
    nameProduct:string
    describeProduct:string
    expirationDate:Date
    codLot:string
    quantity:number
    priceBuy:number
    priceSell:number
    laboratory:string
    nameSupplier:string
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

export class infoGetProductOrders{
    nameProduct:string
    laboratory:string
    quantity:number
    price:number
}

export class SearchProduct{
    nameProduct:string
}

export class AlertMinStock{
    "codProduct":number
    "nameProduct":string
    "laboratory":string
    "quantity":number
}

export class formatProductsWithLaboratory{
    "nameProduct":string
    "laboratories":string[]
}