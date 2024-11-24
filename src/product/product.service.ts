import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProduct, infoGetProduct, SearchProduct, UpdateProduct } from './dto/create-product.dto';
import { LotService } from 'src/lot/lot.service';
import { ProductslotService } from '../productsLot/productslot.service';
import { CreateProductsLot } from '../productsLot/dto/create-productslot.dto';
import { LaboratoryService } from 'src/laboratory/laboratory.service';

@Injectable()
export class ProductService {

    constructor(@InjectRepository(Product) private productRepository:Repository<Product>,
    private lotService:LotService,
    private productLotService:ProductslotService,
    private laboratoryService:LaboratoryService
    ){}

    async getProducts(){
        const products = await this.productRepository.find();
        const info =[];
        for(let i =0; i<products.length;i++){
            let productLot = await this.productLotService.getProductLotsForCod(products[i].codProduct)
            let totalQuantity = 0;
            for(let j=0;j<productLot.length;j++){
                totalQuantity += productLot[j].quantity
            }
            info[i] = {
                codProduct:products[i].codProduct,
                nameProduct:products[i].nameProduct,
                describeProduct:products[i].describeProduct,
                quantity:totalQuantity,
                priceSell:products[i].price,
                laboratory: products[i].laboratory.nameLaboratory
            }
        }
        return {"products":info,"success":true}
    }

    async getProductForCod(codProduct){
        return this.productRepository.findOne({
            where:{
                codProduct:codProduct
            }
        })
    }

    async getProduct(infoGetProduct:infoGetProduct){
        const laboratory = await this.laboratoryService.getLaboratory(infoGetProduct.laboratory)
        if(laboratory!=null){
            return {"product":await this.productRepository.findOne({
                where:{
                    nameProduct:infoGetProduct.nameProduct,
                    laboratory:laboratory
                }
            }),"success":true}
        }else{
            return HttpStatus.BAD_REQUEST,{"success":false}
        }
    }

    async searchPoduct(nameProduct:SearchProduct){
        const productSearch = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.laboratory', 'laboratory') // Incluir la información del laboratorio
        .where('product.nameProduct LIKE :nameProduct', { nameProduct: `%${nameProduct.nameProduct}%` })
        .getMany();
        return this.formatSearchProduct(productSearch);
    }

    async formatSearchProduct(productSearch){
        const products:Product[] = productSearch
        const info =[];
        for(let i=0;i<productSearch.length;i++){
            let productLot = await this.productLotService.getProductLotsForCod(products[i].codProduct)
            let totalQuantity = 0;
            for(let j=0;j<productLot.length;j++){
                totalQuantity += productLot[j].quantity
            }
            info[i] = {
                codProduct:products[i].codProduct,
                nameProduct:products[i].nameProduct,
                describeProduct:products[i].describeProduct,
                quantity:totalQuantity,
                priceSell:products[i].price,
                laboratory: products[i].laboratory.nameLaboratory
            }
        }
        return {"products":info,"success":true}
    }

    async createProduct(infoProduct:CreateProduct){
        const productFound = await this.getProduct({"nameProduct":infoProduct.nameProduct,
            "laboratory":infoProduct.laboratory})
        if(productFound.product==null){
            if(infoProduct.quantity>0){
                const checkProduct = await this.getProductForCod(infoProduct.codProduct)
                console.log(checkProduct)
                if(checkProduct==null){
                    const laboratory = await this.laboratoryService.getLaboratory(infoProduct.laboratory)
                    const product = {
                        codProduct:infoProduct.codProduct,
                        nameProduct: this.formatNames(infoProduct.nameProduct),
                        describeProduct:infoProduct.describeProduct,
                        price:infoProduct.priceSell,
                        laboratory: laboratory,
                    }   
                    const newProduct = this.productRepository.create(product)
                    await this.productRepository.save(newProduct)
                    await this.lotService.createLot({"codLot":infoProduct.codLot})
                    const productLot:CreateProductsLot = {
                        "codProduct":infoProduct.codProduct,
                        "codLot": infoProduct.codLot,
                        "expirationDate":infoProduct.expirationDate,
                        "price":infoProduct.priceBuy,
                        "quantity":infoProduct.quantity,
                        "availability":true
                    }
                    return await this.productLotService.createProductLot(productLot),{"success":true}  
                }else{
                    return HttpStatus.BAD_REQUEST,{"warning":"El codigo de producto que ingresaste ya esta asociado a un producto",
                        "success":false}
                }    
            }else{
                return HttpStatus.BAD_REQUEST,{"warning":"La cantidad del producto no puede ser 0","success":false}
            }
        }else{
            const checkProduct = this.getProductForCod(productFound.product.codProduct)
            if(checkProduct!=null){
                const checkLot = this.lotService.getLot(infoProduct.codLot)
                if(checkLot==null){
                    await this.lotService.createLot({"codLot":infoProduct.codLot})
                    productFound.product.price = infoProduct.priceSell
                    productFound.product.describeProduct = infoProduct.describeProduct
                    this.productRepository.save(productFound.product)
                    const productLot:CreateProductsLot = {
                        "codProduct":infoProduct.codProduct,
                        "codLot": infoProduct.codLot,
                        "expirationDate":infoProduct.expirationDate,
                        "price":infoProduct.priceBuy,
                        "quantity":infoProduct.quantity,
                        "availability":true
                    }        
                    return await this.productLotService.createProductLot(productLot),{"success":true}
                }else{
                    return HttpStatus.BAD_REQUEST,{"warning":"El lote que va a ingresar ya se encuentra registrado","success":false}
                }
            }else{
                return HttpStatus.BAD_REQUEST,{"warning":"Verifica el codigo del producto","success":false}
            }
        }
    }

    async updateProduct(codProduct,infoUpdate:UpdateProduct){
        const updateProduct = {
            "nameProduct":infoUpdate.nameProduct,
            "describeProduct":infoUpdate.describeProduct,
            "price":infoUpdate.priceSell,
            "laboratory": await this.laboratoryService.getLaboratory(infoUpdate.laboratory)
        }
        return await this.productRepository.update(codProduct,updateProduct)
    }

    formatNames(string:string){
        let tmp = string.split(" ");
        let out = "";
        for(let i=0;i<tmp.length;i++){
            tmp[i] = tmp[i].toLowerCase()
            tmp[i] = tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1)
            out += tmp[i]+" ";
        }
        return out;
    }
}
