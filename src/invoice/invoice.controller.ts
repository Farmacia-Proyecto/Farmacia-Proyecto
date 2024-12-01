import { Body, Controller, Get, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoice } from './dto/invoice.dto';
import { infoReportGeneralSell, infoReportSpecificProductSell } from './dto/reports.dto';

@Controller('invoice')
export class InvoiceController {

    constructor(private invoiceService:InvoiceService){}

    @Post()
    createInvoice(@Body() infoInvoice:CreateInvoice){
        return this.invoiceService.createInvoice(infoInvoice)
    }

    @Post("/generalReport")
    async reportGeneralSell(@Body() rangDate:infoReportGeneralSell){
        return this.invoiceService.reportGeneralSell(rangDate)
    }

    @Post("/specificProductReport")
    async reportSpecificSell(@Body() rangDate:infoReportSpecificProductSell){
        return this.invoiceService.reportSpecificPoductSell(rangDate)
    }

}
