import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateSupplierDto } from './dto/supplier.dto';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {

    constructor(private supplierService:SuppliersService){}


    @Get()
    async getSuppliers(){
        return this.supplierService.getSupliers()
    }


    @Post()
    createSupplier(@Body() infoSupplier:CreateSupplierDto){
        console.log(infoSupplier)
        return this.supplierService.createSupplier(infoSupplier)
    }


    @Put(":nit")
    updateSupplier(){

    }

}
