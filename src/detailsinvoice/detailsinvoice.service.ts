import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailsInvoice } from './detailsinvoice.entity';
import { Repository } from 'typeorm';
import { CreateDetailsInvoice } from './dto/detailsInvoice.dto';


@Injectable()
export class DetailsinvoiceService {

    constructor(@InjectRepository(DetailsInvoice) private detailsInvoiceRepository:Repository<DetailsInvoice>){}

    createDetailsInvoice(codInvoice,products:CreateDetailsInvoice[]){
        try {
            for(let i=0;i<products.length;i++){
                const details = {
                    "codInvoice":codInvoice,
                    "codProduct":products[i].codProduct,
                    "quantity":products[i].quantity,
                    "price":(products[i].totalPrice*0,19)+products[i].totalPrice
                }
                const newDetails = this.detailsInvoiceRepository.create(details)
                this.detailsInvoiceRepository.save(newDetails)
            }
            return {"success":true}
        } catch (error) {
            return {"error":"No se pudieron cargar los detalles de la factura","success":false}
        }
        
    }
}
