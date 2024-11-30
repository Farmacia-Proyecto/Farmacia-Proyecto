import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateOrder, FormatGetOrders } from './dto/pucharseorder.dto';
import { REQUEST } from '@nestjs/core';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { PersonService } from 'src/person/person.service';
import { CreateOrderDetails } from 'src/orderdetails/dto/orderdetails.dto';
import { OrderdetailsService } from 'src/orderdetails/orderdetails.service';
import { infoProductCotizacion } from 'src/email/dto/send-email.dto';
import { infoGetProductOrders } from 'src/product/dto/create-product.dto';

@Injectable()
export class PurchaseorderService {

    constructor(@InjectRepository(PurchaseOrder) private purchaseOrderRepository:Repository<PurchaseOrder>,
    @Inject(REQUEST) private readonly request: any,
    @Inject(forwardRef(()=>ProductService)) private productService:ProductService,
    private supplierService:SuppliersService,
    private personService:PersonService,
    private orderDetailsService:OrderdetailsService
    ){}

    async getOrders(){
       return {"orders": await this.formatGetOrders(),"success":true}
    }

    async formatGetOrders(){
        const orders = await this.purchaseOrderRepository.find({
            relations:['supplier']
        })
        const format:FormatGetOrders[] = []
        const formatProducts:infoGetProductOrders[] = []
        for(let i=0;i<orders.length;i++){
            const details = orders[i].orderDetails
            for(let j=0;j<details.length;j++){
                formatProducts[j]= {
                    "nameProduct":(await this.productService.getProductForCod(details[j].codProduct)).nameProduct,
                    "laboratory": (await this.productService.getProductForCod(details[j].codProduct)).laboratory.nameLaboratory,
                    "quantity":details[j].quantity
                }
            }
            format[i] = {
                "codOrder":orders[i].codOrder,
                "nameSupplier":orders[i].supplier.nameSupplier,
                "dateRegister":orders[i].orderDate,
                "state":orders[i].state,
                "products": formatProducts
            }
        }
        return format
    }

    getOrder(corOrder){
        return this.purchaseOrderRepository.findOne({
            where:{
                codOrder:corOrder
            }
        })
    }

    async createOrder(orders:CreateOrder[]){
        try {
            console.log(orders)
            const date = new Date()
            const supliers = this.selectSuppliers(orders)
            const person = await this.personService.searchPersonByUserName(orders[0].userName)
            for(let i=0;i<supliers.length;i++){
                const details:CreateOrderDetails[] = []
                const productEmail:infoProductCotizacion[] = []
                const codOrder = await this.generatedCodOrder()
                for(let j=0;j<orders.length;j++){
                    if(supliers[i]===orders[j].nameSupplier){
                        const product = await this.productService.getProduct({"nameProduct":orders[j].nameProduct,
                            "laboratory":orders[j].laboratory})
                            details[details.length]={
                            "codOrder": codOrder,
                            "codProduct": product.product.codProduct,
                            "quantity": orders[j].quantity,
                        }
                        productEmail[productEmail.length] = {
                            "codProduct": product.product.codProduct,
                            "nameProduct":product.product.nameProduct,
                            "quantity":orders[j].quantity
                        }
                    }
                }
                const order = this.purchaseOrderRepository.create({
                    "codOrder":codOrder,
                    "orderDate":date,
                    "supplier": await this.supplierService.getSupplier(orders[i].nameSupplier),
                    "person": person,
                    "state": "Enviada"
                })
                await this.purchaseOrderRepository.save(order)
                this.orderDetailsService.createOrderDetails(details)
                this.personService.sendCotizacion({"products":productEmail,
                    "name":(person.namePerson +" "+person.lastNamePerson),
                    "phone":person.phone, "email": person.email,
                    "supplier":orders[i].nameSupplier,"typeUser":person.user.typeUser})
            }
            return {"success":true}
        } catch (error) {
            return HttpStatus.BAD_REQUEST,{"success":false}
        }
    }



    selectSuppliers(orders:CreateOrder[]){
        const suppliers = []
        for(let i =0;i<orders.length;i++){
            if(!suppliers.includes(orders[i].nameSupplier)){
                suppliers[suppliers.length]=orders[i].nameSupplier
            }
        }
        return suppliers
    }


    async generatedCodOrder(){
        const size = await this.purchaseOrderRepository.find()
        return  size.length + 1
    }

}
