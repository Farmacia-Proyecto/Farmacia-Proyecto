import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from './orderdetails.entity';
import { Repository } from 'typeorm';
import { CreateOrderDetails } from './dto/orderdetails.dto';
import { ProductsRecive } from 'src/purchaseorder/dto/pucharseorder.dto';

@Injectable()
export class OrderdetailsService {

    constructor(@InjectRepository(OrderDetails) private orderDetailsRepository:Repository<OrderDetails>){}

    async createOrderDetails(orderdetails:CreateOrderDetails[]){
        for(let i=0;i<orderdetails.length;i++){
            const details = this.orderDetailsRepository.create(orderdetails[i])
            await this.orderDetailsRepository.save(details)
        }
    }


    async searchOrderDetails(codOrder,codProduct){
        return await this.orderDetailsRepository.findOne({
            where:{
                "codOrder": codOrder,
                "codProduct": codProduct
            }
        })
    }

    async updateOrderDetails(codOrder,codProduct,price,quantity){
        const orderDetails = await this.orderDetailsRepository.findOne({
            where:{
                "codOrder": codOrder,
                "codProduct": codProduct
            }
        })
        if(orderDetails!=null){
            orderDetails.price =price
            orderDetails.quantity = quantity
            this.orderDetailsRepository.save(orderDetails)
        }
    }

    async updateOrderInProgess(codOrder){
        const order = await this.orderDetailsRepository.findBy({
            codOrder:codOrder
        })
        for(let i=0;i<order.length;i++){
            if(order[i].price==0){
                this.orderDetailsRepository.delete(order[i])
            }
        }
    }

    async checkOrderRecive(codOrder,products:ProductsRecive[]){
        let check:boolean = false
        const order = await this.orderDetailsRepository.findBy({
            codOrder:codOrder
        })
        for(let i=0;i<order.length;i++){
            for(let j=0;j<products.length;j++){
                if(order[i].product.nameProduct==products[j].nameProduct){
                    check = true
                    break
                }
            }
            if(check==false){
                this.orderDetailsRepository.delete(order[i])
            }
        }
    }


}
