import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { Repository } from 'typeorm';
import { CreateInvoice } from './dto/invoice.dto';
import { DetailsinvoiceService } from 'src/detailsinvoice/detailsinvoice.service';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class InvoiceService {

    constructor(@InjectRepository(Invoice) private invoiceRepository:Repository<Invoice>,
    private detailsInvoiceService:DetailsinvoiceService,
    private personService:PersonService
    ){}

    async getInvoices(){
        return this.invoiceRepository.find()
    }

    async createInvoice(infoInvoice:CreateInvoice){
        try {
            const person = await this.personService.searchPersonByUserName(infoInvoice.userName)
            const invoice = {
                "codInvoice": await this.generatedCodInvoice(),
                "date":infoInvoice.dateInvoice,
                "documentClient":infoInvoice.documentClient,
                "typePayment":infoInvoice.typePay,
                "subTotal":infoInvoice.subTotal,
                "iva":infoInvoice.iva,
                "totalPay":infoInvoice.totalPay,
                "person":person
            }
            const newInvoice = this.invoiceRepository.create(invoice)
            this.invoiceRepository.save(newInvoice)
            this.detailsInvoiceService.createDetailsInvoice(newInvoice.codInvoice,infoInvoice.products)
            return {"success":true}
        } catch (error) {
            return {"error":"No se pudo crear la factura intente nuevamente","success":false}
        }
        
    }

     async generatedCodInvoice(){
        const size = await this.getInvoices()
        return  size.length + 1
    }

}
