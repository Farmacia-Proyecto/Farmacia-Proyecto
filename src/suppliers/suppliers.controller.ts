import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
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
        return this.supplierService.createSupplier(infoSupplier)
    }


    @Put(":nit")
    updateSupplier(@Param("nit",ParseIntPipe) nit:number,@Body() info){
        return this.supplierService.updateSupplier(nit,info)
    }

    @Post("/search")
    async getPerson(@Body() supplier){
        return await this.supplierService.searchSupplier(supplier)
     }

     
}
