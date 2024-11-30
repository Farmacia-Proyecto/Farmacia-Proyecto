export class SendEmail{
    userName?:string
    password?:string
    email:string
}

export class sendCotizacion{
    name:string
    typeUser:string
    phone:number
    emailSupplier:string
    email:string
    supplier:string
    products:infoProductCotizacion[]
}

export class infoProductCotizacion{
    codProduct:number
    nameProduct:string
    quantity:number
}