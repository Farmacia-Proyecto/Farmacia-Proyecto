import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProduct, UpdateProduct } from './dto/create-product.dto';
import { AuthGuard } from 'src/login/login.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {

    constructor(private productService:ProductService){}

    

    @Get()
    getProducts(){
        console.log(this.productService.getProducts())
        return this.productService.getProducts()
    }

    @Get(':codProduct')
    getProduct(@Param('codProduct',ParseIntPipe) codProduct:number){
        return this.productService.getProduct(codProduct)
    }

    @Post('/search')
    searchProduct(@Body() nameProduct){
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
}
