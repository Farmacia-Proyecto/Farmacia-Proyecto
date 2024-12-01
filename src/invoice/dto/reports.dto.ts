export class infoReportGeneralSell{
    "startDate":Date
    "finalDate":Date
}

export class infoReportSpecificProductSell{
    "startDate":Date
    "finalDate":Date
    "nameProduct":string
    "laboratory":string
}

export class getReportGeneral{
    "codInvoice":number
    "date": string
    "namePerson":string
    "documentPerson":number
    "documentClient": number
    "typePayment": string
    "totalPay": number
    "subTotal": number
    "iva": number
    "details": formatDetails[]
}

export class formatDetails{
    "nameProduct":string
    "laboratory":string
    "quantity":number
    "totalPrice":number
    "unitPrice":number
}

export class getReportSpecifyProduct{
    "codInvoice":number
    "date": string
    "namePerson":string
    "documentPerson":number
    "documentClient": number
    "typePayment": string
    "totalPay": number
    "subTotal": number
    "iva": number
    "details":formatDetails[]
}