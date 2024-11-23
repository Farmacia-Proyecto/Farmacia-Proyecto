import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProduct, UpdateProduct } from './dto/create-product.dto';
import { LotService } from 'src/lot/lot.service';
import { ProductslotService } from '../productsLot/productslot.service';
import { CreateProductsLot } from '../productsLot/dto/create-productslot.dto';
import { ProductslaboratoryService } from 'src/productslaboratory/productslaboratory.service';
import { createProductLaboratory } from 'src/productsLaboratory/dto/productLaboratory.dto';

@Injectable()
export class ProductService {

    constructor(@InjectRepository(Product) private productRepository:Repository<Product>,
    private lotService:LotService,
    private productLotService:ProductslotService,
    private productsLaboratoryService:ProductslaboratoryService,
    ){}

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

    async createProduct(infoProduct:CreateProduct){
        const productFound = await this.getProduct(infoProduct.codProduct)
        console.log("Informacion que llega al metodo createProduct")
        console.log(infoProduct)
        if(productFound==null){
            if(infoProduct.quantity>0){
                const product = {
                    codProduct:infoProduct.codProduct,
                    nameProduct: this.formatNames(infoProduct.nameProduct),
                    describeProduct:infoProduct.describeProduct
                }
                console.log("Producto")
                console.log(product)
                const newProduct = this.productRepository.create(product)
                await this.productRepository.save(newProduct)
                await this.lotService.createLot({"codLot":infoProduct.codLot})
                const productLot:CreateProductsLot = {
                    "codProduct":infoProduct.codProduct,
                    "codLot": infoProduct.codLot,
                    "expirationDate":infoProduct.expirationDate,
                    "price":infoProduct.priceSell,
                    "quantity":infoProduct.quantity,
                    "availability":true
                }
                
                const productLaboratory:createProductLaboratory = {
                    "codProduct":infoProduct.codProduct,
                    "nameLaboratory":infoProduct.laboratory,
                    "price":infoProduct.priceBuy
                }
                console.log("PoductoLab")
                console.log(productLaboratory)
                await this.productsLaboratoryService.createProductLaboratory(productLaboratory)
                
                return await this.productLotService.createProductLot(productLot),{"success":true}      
            }
        }else{
            this.lotService.createLot({"codLot":infoProduct.codLot})
            const productLot:CreateProductsLot = {
                "codProduct":infoProduct.codProduct,
                "codLot": infoProduct.codLot,
                "expirationDate":infoProduct.expirationDate,
                "price":infoProduct.priceSell,
                "quantity":infoProduct.quantity,
                "availability":true
            }        
            return this.productLotService.createProductLot(productLot),{"success":true}
        }
        return HttpStatus.BAD_REQUEST,{"success":false}
    }

    updateProduct(codProduct,infoUpdate:UpdateProduct){
        return this.productRepository.update(codProduct,infoUpdate)
    }

    formatNames(string:string){
        let tmp = string.split(" ");
        let out = "";
        for(let i=0;i<tmp.length;i++){
            tmp[i] = tmp[i].toLowerCase()
            tmp[i] = tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1)
            console.log(tmp[i])
            out += tmp[i]+" ";
        }
        console.log(out)
        return out;
    }
}
