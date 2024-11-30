import { Body, Controller, Get, Post } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';
import { CreateOrder } from './dto/pucharseorder.dto';

@Controller('purchaseorder')
export class PurchaseorderController {

    constructor(private purchaseOrderService:PurchaseorderService){}

    
    @Get()
    getOrders(){
        return this.purchaseOrderService.getOrders()
    }

    @Post()
    createOrder(@Body() infoOrder:CreateOrder[]){
        return this.purchaseOrderService.createOrder(infoOrder)
    }

    @Get("/alert")
    alertMinStock(){
        return this.purchaseOrderService.generatedAlertMinStock()
    }

    @Get("/acceptOrder")
    aceeptOrder(){
        return this.purchaseOrderService.acceptViewOrder()
    }

}
