import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';
import { CreateOrder, InProgrees } from './dto/pucharseorder.dto';

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

    @Put("/inProgrees/:codOrder")
    updateInProgrees(@Param("codOrder",ParseIntPipe) codOrder, @Body() info:InProgrees ){
        return this.purchaseOrderService.changeStateInProgress(codOrder,info)
    }

}
