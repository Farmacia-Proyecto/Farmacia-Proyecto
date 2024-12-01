import { Body, Controller, Get, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoice } from './dto/invoice.dto';
import { infoReportGeneralSell } from './dto/reports.dto';

@Controller('invoice')
export class InvoiceController {

    constructor(private invoiceService:InvoiceService){}

    @Post()
    createInvoice(@Body() infoInvoice:CreateInvoice){
        return this.invoiceService.createInvoice(infoInvoice)
    }

    @Get("/generalReport")
    async reportGeneralSell(@Body() rangDate:infoReportGeneralSell){
        return this.invoiceService.reportGeneralSell(rangDate)
    }

}
