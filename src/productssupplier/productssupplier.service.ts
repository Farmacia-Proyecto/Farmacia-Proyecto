import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsSupplier } from './productssupplier.entity';
import { Repository } from 'typeorm';
import { CreateProductsSupplierDto } from './dto/productssupplier.dto';

@Injectable()
export class ProductssupplierService {

    constructor(@InjectRepository(ProductsSupplier) private productsSupplierRepository:Repository<ProductsSupplier>){}

    async createProductsSupplier(info:CreateProductsSupplierDto){
        const newProductSupplier = this.productsSupplierRepository.create(info)
        return this.productsSupplierRepository.save(newProductSupplier),{"success":true}
    }


    async getProductsSupplierForNit(nit){
        const laboratorySuppliers = await this.productsSupplierRepository.find({
            where: { nit },
            relations: ['product'],
        });
        return laboratorySuppliers
    }

    async getProductsSupplierForCodProduct(codProduct){
        const laboratorySuppliers = await this.productsSupplierRepository.find({
            where: { codProduct },
            relations: ['supplier'],
        });
        return laboratorySuppliers
    }

}
