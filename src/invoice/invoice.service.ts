import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { Repository } from 'typeorm';
import { CreateInvoice } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {

    constructor(@InjectRepository(Invoice) private invoiceRepository:Repository<Invoice>){}

    createInvoice(infoInvoice:CreateInvoice){
        
    }


}
