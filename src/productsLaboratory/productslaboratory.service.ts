import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsLaboratory } from './productlaboratory.entity';
import { Repository } from 'typeorm';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { createProductLaboratory, getProductLaboratory } from './dto/productLaboratory.dto';

@Injectable()
export class ProductslaboratoryService {

    constructor(@InjectRepository(ProductsLaboratory) private productsLaboratoryRepository:Repository<ProductsLaboratory>,
    private laboratoryService:LaboratoryService
    ){}

    async getProductLaboratory(info:getProductLaboratory){
        const laboratory = await this.laboratoryService.getLaboratory(info.nameLaboratory)
        console.log(laboratory.nit);
        return await this.productsLaboratoryRepository.findOne({
            where:{
                codProduct:info.codProduct,
                nit: laboratory.nit
            }
        })
    }

    async createProductLaboratory(infoProduct:createProductLaboratory){
        console.log("Informacion que llega al crear producto laboratorio")
        console.log(infoProduct)
        const productLaboratoryFound = await this.getProductLaboratory({"codProduct":infoProduct.codProduct,
            "nameLaboratory":infoProduct.nameLaboratory})
        const laboratory = await this.laboratoryService.getLaboratory(infoProduct.nameLaboratory)
        if(productLaboratoryFound==null){
            const info = {
                "codProduct":infoProduct.codProduct,
                "nit": laboratory.nit,
                "price":infoProduct.price
            }
            const productLaboratory = this.productsLaboratoryRepository.create(info)
            return this.productsLaboratoryRepository.save(productLaboratory)
        }else{
            const laboratory = await this.laboratoryService.getLaboratory(infoProduct.nameLaboratory)
            return await this.productsLaboratoryRepository.update(
                {codProduct:infoProduct.codProduct,nit:laboratory.nit}
                ,{price:infoProduct.price})
        }
    }

}
