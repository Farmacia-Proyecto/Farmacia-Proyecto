import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from './orderdetails.entity';
import { Repository } from 'typeorm';
import { CreateOrderDetails } from './dto/orderdetails.dto';

@Injectable()
export class OrderdetailsService {

    constructor(@InjectRepository(OrderDetails) private orderDetailsRepository:Repository<OrderDetails>){}

    async createOrderDetails(orderdetails:CreateOrderDetails[]){
        for(let i=0;i<orderdetails.length;i++){
            const details = this.orderDetailsRepository.create(orderdetails[i])
            await this.orderDetailsRepository.save(details)
        }
    }

}
