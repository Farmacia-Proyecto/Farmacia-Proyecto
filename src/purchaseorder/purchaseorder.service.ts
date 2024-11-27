import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateOrder } from './dto/pucharseorder.dto';

@Injectable()
export class PurchaseorderService {

    constructor(@InjectRepository(PurchaseOrder) private purchaseOrderRepository:Repository<PurchaseOrder>,
    private productService:ProductService
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
        const supliers = this.selectSuppliers(orders)
        for(let i=0;i<supliers.length;i++){
            const details = []
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
                }
            }
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
