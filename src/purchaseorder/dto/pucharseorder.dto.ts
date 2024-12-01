import { infoGetProductOrders } from "src/product/dto/create-product.dto"

export class CreateOrder{
    "nameProduct":string
    "nameSupplier":string
    "laboratory":string
    "quantity":number
    "userName":string
    "state":string
}

export class FormatGetOrders{
    "codOrder":number
    "nameSupplier":string
    "dateRegister":Date
    "state":string
    "products":infoGetProductOrders[]
}  


export class InProgrees{
    "state":string
    "products": productInProgrees[]
}

export class productInProgrees{
    "nameProduct":string
    "laboratory":string
    "quantity":number
    "price":number
}