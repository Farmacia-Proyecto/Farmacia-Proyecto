import { Body, Controller, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoice } from './dto/invoice.dto';

@Controller('invoice')
export class InvoiceController {

    constructor(private invoiceService:InvoiceService){}

    @Post()
    createInvoice(@Body() infoInvoice:CreateInvoice){
        return this.invoiceService.createInvoice(infoInvoice)
    }


}
