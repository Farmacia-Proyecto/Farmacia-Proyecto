import { infoGetProduct } from "src/product/dto/create-product.dto"

export class CreateOrder{
    "nameProduct":string
    "nameSupplier":string
    "laboratory":string
    "quantity":number
}

export class FormatGetOrders{
    "codOrder":number
    "nameSupplier":string
    "dateRegister":Date
    "state":string
    "products":infoGetProduct[]
}   