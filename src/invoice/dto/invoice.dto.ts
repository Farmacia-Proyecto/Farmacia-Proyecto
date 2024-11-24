import { CreateDetailsInvoice } from "src/detailsinvoice/dto/detailsInvoice.dto";

export class CreateInvoice{
    "dateInvoice":Date
    "documentClient":number
    "typePay":string
    "subTotal":number
    "iva":number
    "totalPay":number
    "userName":string
    "products": CreateDetailsInvoice[]
}

