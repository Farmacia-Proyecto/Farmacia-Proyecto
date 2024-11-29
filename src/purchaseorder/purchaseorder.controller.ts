import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';

@Controller('/purchaseorder')
export class PurchaseorderController {

    constructor(private purchaseOrderService:PurchaseorderService){}

    @Post()
    createOrder(@Body() infoOrder){
        return this.purchaseOrderService.createOrder(infoOrder)
    }

}
