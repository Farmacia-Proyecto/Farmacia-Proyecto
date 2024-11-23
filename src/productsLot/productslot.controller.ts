import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { ProductslotService } from './productslot.service';

@Controller('productslot')
export class ProductslotController {

    constructor(private productLotsService:ProductslotService){}

    @Get(":codProduct")
    getLotsForCod(@Param("codProduct",ParseIntPipe) codProduct:number){
        return this.productLotsService.getProductLotsForCod(codProduct)
    }

}
