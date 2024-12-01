import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { Repository } from 'typeorm';
import { CreateInvoice } from './dto/invoice.dto';
import { DetailsinvoiceService } from 'src/detailsinvoice/detailsinvoice.service';
import { PersonService } from 'src/person/person.service';
import { formatDetails, getReportGeneral, getReportSpecifyProduct, infoReportGeneralSell, infoReportSpecificProductSell } from './dto/reports.dto';
import { format } from 'util';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class InvoiceService {

    constructor(@InjectRepository(Invoice) private invoiceRepository:Repository<Invoice>,
    private detailsInvoiceService:DetailsinvoiceService,
    private personService:PersonService,
    private productService:ProductService
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


    async reportGeneralSell(rangDate:infoReportGeneralSell){
        const startDate = rangDate.startDate
        const finalDate = rangDate.finalDate
        const invoices = await this.invoiceRepository
        .createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.person','person')
        .leftJoinAndSelect('invoice.detailsInvoice','detailsInvoice')
        .leftJoinAndSelect('detailsInvoice.product','product')
        .leftJoinAndSelect('product.laboratory','laboratory')
        .where('invoice.date BETWEEN :startDate AND :finalDate', { 
            startDate,
            finalDate
        })
        .getMany();
        return this.formatGeneralSell(invoices)
    }

    async formatGeneralSell(invoices:Invoice[]){
        try {
            const formatGeneralSell:getReportGeneral[]=[]
            for(let i=0;i<invoices.length;i++){
                const formatDetails:formatDetails[]=[]
                const detailInvoice = invoices[i].detailsInvoice
                for(let j=0;j<detailInvoice.length;j++){
                    formatDetails[j] ={
                        "nameProduct":detailInvoice[j].product.nameProduct,
                        "laboratory":detailInvoice[j].product.laboratory.nameLaboratory,
                        "quantity":detailInvoice[j].quantity,
                        "totalPrice":detailInvoice[j].price,
                        "unitPrice":detailInvoice[j].product.price
                    } 
                }
                const date = format(new Date(invoices[i].date), 'yyyy-MM-dd');
                formatGeneralSell[i] = {
                    "codInvoice":invoices[i].codInvoice,
                    "date":date,
                    "documentClient":invoices[i].documentClient,
                    "namePerson": invoices[i].person.namePerson +" "+invoices[i].person.lastNamePerson,
                    "documentPerson": invoices[i].person.document,
                    "typePayment": invoices[i].typePayment,
                    "subTotal": invoices[i].subTotal,
                    "iva": invoices[i].iva,
                    "totalPay":invoices[i].totalPay,
                    "details": formatDetails
                }
            }
            return {"invoices":formatGeneralSell,"success":true}
        } catch (error) {
            return {"success":false}   
        }
    }

    async reportSpecificPoductSell(infoReportSpecifucProductSell:infoReportSpecificProductSell){
        const startDate = infoReportSpecifucProductSell.startDate
        const finalDate = infoReportSpecifucProductSell.finalDate
        const invoices = await this.invoiceRepository
        .createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.person','person')
        .leftJoinAndSelect('invoice.detailsInvoice','detailsInvoice')
        .leftJoinAndSelect('detailsInvoice.product','product')
        .leftJoinAndSelect('product.laboratory','laboratory')
        .where('invoice.date BETWEEN :startDate AND :finalDate', { 
            startDate,
            finalDate
        })
        .getMany();
        return this.formatSpecificProductSell(invoices,infoReportSpecifucProductSell.nameProduct,
            infoReportSpecifucProductSell.laboratory)
    }

    async formatSpecificProductSell(invoices:Invoice[],nameProduct,laboratory){
        try {
            const formatGeneralSell:getReportSpecifyProduct[]=[]
            for(let i=0;i<invoices.length;i++){
                let formatDetails:formatDetails = null
                const detailInvoice = invoices[i].detailsInvoice
                for(let j=0;j<detailInvoice.length;j++){
                    const product = await this.productService.getProduct({"nameProduct":nameProduct,"laboratory":laboratory})
                    if(detailInvoice[j].product.codProduct===product.product.codProduct){
                        formatDetails ={
                            "nameProduct":detailInvoice[j].product.nameProduct,
                            "laboratory":detailInvoice[j].product.laboratory.nameLaboratory,
                            "quantity":detailInvoice[j].quantity,
                            "totalPrice":detailInvoice[j].price,
                            "unitPrice":detailInvoice[j].product.price
                        }
                    } 
                }
                const date = format(new Date(invoices[i].date), 'yyyy-MM-dd');
                if(formatDetails!=null){
                    formatGeneralSell[formatGeneralSell.length] = {
                        "codInvoice":invoices[i].codInvoice,
                        "date":date,
                        "documentClient":invoices[i].documentClient,
                        "namePerson": invoices[i].person.namePerson +" "+invoices[i].person.lastNamePerson,
                        "documentPerson": invoices[i].person.document,
                        "typePayment": invoices[i].typePayment,
                        "subTotal": invoices[i].subTotal,
                        "iva": invoices[i].iva,
                        "totalPay":invoices[i].totalPay,
                        "details": formatDetails
                    }
                }
            }
            return {"invoices":formatGeneralSell,"success":true}
        } catch (error) {
            return {"success":false}   
        }
    }
}
