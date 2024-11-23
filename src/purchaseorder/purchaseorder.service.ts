import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseorderService {

    constructor(@InjectRepository(PurchaseOrder) private purchaseOrderRepository:Repository<PurchaseOrder>){}

    getOrder(corOrder){
        return this.purchaseOrderRepository.findOne({
            where:{
                codOrder:corOrder
            }
        })
    }

}
