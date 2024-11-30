import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateOrder } from './dto/pucharseorder.dto';
import { REQUEST } from '@nestjs/core';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { PersonService } from 'src/person/person.service';
import { CreateOrderDetails } from 'src/orderdetails/dto/orderdetails.dto';
import { OrderdetailsService } from 'src/orderdetails/orderdetails.service';
import { infoProductCotizacion } from 'src/email/dto/send-email.dto';

@Injectable()
export class PurchaseorderService {

    constructor(@InjectRepository(PurchaseOrder) private purchaseOrderRepository:Repository<PurchaseOrder>,
    @Inject(REQUEST) private readonly request: any,
    @Inject(forwardRef(()=>ProductService)) private productService:ProductService,
    private supplierService:SuppliersService,
    private personService:PersonService,
    private orderDetailsService:OrderdetailsService
    ){}

    getOrders(){

    }

    getOrder(corOrder){
        return this.purchaseOrderRepository.findOne({
            where:{
                codOrder:corOrder
            }
        })
    }

    async createOrder(orders:CreateOrder[]){
        //try {
            //console.log(await this.request.user.userName)
            const date = new Date()
            const supliers = this.selectSuppliers(orders)
            console.log(this.purchaseOrderRepository)
            const person = await this.personService.searchPersonByUserName(this.request.user.userName)
            for(let i=0;i<supliers.length;i++){
                const details:CreateOrderDetails[] = []
                const productEmail:infoProductCotizacion[] = []
                const codOrder = await this.generatedCodOrder()
                for(let j=0;i<orders.length;j++){
                    if(supliers[i]==orders[j].nameSupplier){
                        const product = await this.productService.getProduct({"nameProduct":orders[j].nameProduct,
                            "laboratory":orders[j].laboratory})
                            details[details.length]={
                            "codOrder":codOrder,
                            "codProduct": product.product.codProduct,
                            "quantity": orders[j].quantity
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
                    "person": person
                })
                this.purchaseOrderRepository.save(order)
                this.orderDetailsService.createOrderDetails(details)
                this.personService.sendCotizacion({"products":productEmail,
                    "name":(person.namePerson +" "+person.lastNamePerson),
                    "phone":person.phone, "email": person.email,
                    "supplier":orders[i].nameSupplier,"typeUser":person.user.typeUser})
            }
        //} catch (error) {
            //return HttpStatus.BAD_REQUEST
        //}
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
