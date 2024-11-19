import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProduct, UpdateProduct } from './dto/create-product.dto';

@Injectable()
export class ProductService {

    constructor(@InjectRepository(Product) private productRepository:Repository<Product>){}

    async getProducts(){
        return await this.productRepository.find()
    }

    async getProduct(codProduct:number){
        return await this.productRepository.findOne({
            where:{
                codProduct:codProduct
            }
        })
    }

    async searchPoduct(nameProduct){
        const productSearch = await this.productRepository.createQueryBuilder('Product')
        .where('nameProduct LIKE :nameProduct',{nameProduct: `%${nameProduct}%`})
        .getMany();
        return productSearch;
    }

    createProduct(infoProduct:CreateProduct){
        const productFound = this.getProduct(infoProduct.codProduct)
        if(productFound==null){
            const product = {
                codProduct:infoProduct.codProduct,
                nameProduct:infoProduct.describeProduct.toUpperCase(),
                describeProduct:infoProduct.describeProduct.toUpperCase()
            }
            const newProduct = this.productRepository.create(product)
            return this.productRepository.save(newProduct),{"success":true}
        }
        return HttpStatus.BAD_REQUEST,{"success":true}
    }

    updateProduct(codProduct,infoUpdate:UpdateProduct){
        return this.productRepository.update(codProduct,infoUpdate)
    }
}
