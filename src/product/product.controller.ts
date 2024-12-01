import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProduct, UpdateProduct } from './dto/create-product.dto';
import { AuthGuard } from 'src/login/login.guard';

@Controller('products')
//@UseGuards(AuthGuard)
export class ProductController {

    constructor(private productService:ProductService){}


    @Get()
    async getProducts(){
        return this.productService.getProducts()
    }

    @Get("/change-laboratories/:nameSupplier")
    async getNamesLaboratories(@Param('nameSupplier') nameSupplier){
        return this.productService.getNamesLaboratories(nameSupplier)
    }

    @Post('/search')
    async searchProduct(@Body() nameProduct){
        return this.productService.searchPoduct(nameProduct)
    }

    @Post()
    createProduct(@Body() infoProduct:CreateProduct){
        return this.productService.createProduct(infoProduct)
    }

    @Put(':codProduct')
    updateProduct(@Param('codProduct',ParseIntPipe) codProduct:number,@Body() infoProduct:UpdateProduct){
        return this.productService.updateProduct(codProduct,infoProduct)
    }

    @Get("/productsReport")
    async getProductsReport(){
        console.log( await this.productService.getProductsWithLaboratory())
        return this.productService.getProductsWithLaboratory()
    }

}
