import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsLot } from './productlot.entity';
import { Repository } from 'typeorm';
import { CreateProductsLot } from './dto/create-productslot.dto';

@Injectable()
export class ProductslotService {

    constructor(@InjectRepository(ProductsLot) private productsLotRepository:Repository<ProductsLot>){}

    async getProductsLot(){
        return await this.productsLotRepository.find()
    }

    async getProductLotsForName(nameProduct){
        return await this.productsLotRepository.find({
            where:{
                product:{
                    nameProduct:nameProduct
                }
            }
        })
    }

    async getProductLotsForCod(codProduct){
        return await this.productsLotRepository.findBy({
            codProduct:codProduct
        })
    }

    async getProductLotsForCodLotAndProduct(codProduct,codLot){
        return await this.productsLotRepository.findOne({
            where:{
                codLot:codLot,
                codProduct:codProduct
            }
        })
    }

    async createProductLot(infoProductLot:CreateProductsLot){
        if(infoProductLot.quantity>0){
            const productLot = this.productsLotRepository.create(infoProductLot)
            return await this.productsLotRepository.save(productLot)
        }
    }
}