import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';
import { CreateOrder } from './dto/pucharseorder.dto';

@Controller('purchaseorder')
export class PurchaseorderController {

    constructor(private purchaseOrderService:PurchaseorderService){}

    @Post()
    createOrder(@Body() infoOrder:CreateOrder[]){
        return this.purchaseOrderService.createOrder(infoOrder)
    }

}
