import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import {  CreateProduct, formatProductsWithLaboratory, infoGetProduct, SearchProduct, UpdateProduct } from './dto/create-product.dto';
import { LotService } from 'src/lot/lot.service';
import { ProductslotService } from '../productsLot/productslot.service';
import { CreateProductsLot } from '../productsLot/dto/create-productslot.dto';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { ProductssupplierService } from 'src/productssupplier/productssupplier.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { Laboratory } from 'src/laboratory/laboratory.entity';
import { LaboratorysuppliersService } from 'src/laboratorysuppliers/laboratorysuppliers.service';
import { CreateProductsSupplierDto } from 'src/productssupplier/dto/productssupplier.dto';
import { ProductsRecive } from 'src/purchaseorder/dto/pucharseorder.dto';

@Injectable()
export class ProductService {

    constructor(@InjectRepository(Product) private productRepository:Repository<Product>,
    @Inject(forwardRef(()=>LotService)) private lotService:LotService,
    private productLotService:ProductslotService,
    private laboratoryService:LaboratoryService,
    private laboratorySuppliersService:LaboratorysuppliersService,
    private productsSupplierService:ProductssupplierService,
    private supplierService:SuppliersService
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
            if(totalQuantity>0){
                info[info.length] = {
                    codProduct:products[i].codProduct,
                    nameProduct:products[i].nameProduct,
                    describeProduct:products[i].describeProduct,
                    quantity:totalQuantity,
                    priceSell:products[i].price,
                    laboratory: products[i].laboratory.nameLaboratory,
                    image: products[i].image
                }
            }
        }
        return {"products":info,"success":true}
    }

    async getProductsWithLaboratory(){
        try {
            const products = await this.productRepository.find({
                relations:['laboratory']
            });
            const listaSinDuplicados = [
                ...new Map(products.map(item => [item.nameProduct, item])).values()
              ];
            const formatProducts:formatProductsWithLaboratory[] = []
            for(let i=0;i<listaSinDuplicados.length;i++){
                const name = listaSinDuplicados[i].nameProduct
                const laboratories =[]
                for(let j=0;j<products.length;j++){
                    if(name==products[j].nameProduct){
                        laboratories[laboratories.length] ={
                            "laboratory": products[j].laboratory.nameLaboratory
                        }
                    }
                }
                formatProducts[i] = {
                    "nameProduct":listaSinDuplicados[i].nameProduct,
                    "laboratories":laboratories
                }
            }
            return {"products":formatProducts,"success":true}   
        } catch (error) {
            return {"success":false}
        }
    }

    async getNamesLaboratories(nameSupplier){
        const suplier = await this.supplierService.getSupplier(nameSupplier)
        const suppliers_laboratories =  await this.laboratorySuppliersService.getLaboratorySupplierForNit(suplier.nit)
        const info = []
        for(let i=0;i<suppliers_laboratories.length;i++){
            info[i] = {
                "codLaboratory": suppliers_laboratories[i].laboratory.codLaboratory,
                "nameLaboratory": suppliers_laboratories[i].laboratory.nameLaboratory
            }
        }
        return {"laboratory": info,"success":true}
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
        .leftJoinAndSelect('product.laboratory', 'laboratory') 
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
            if(totalQuantity>0){
            info[info.length] = {
                codProduct:products[i].codProduct,
                nameProduct:products[i].nameProduct,
                describeProduct:products[i].describeProduct,
                quantity:totalQuantity,
                priceSell:products[i].price,
                laboratory: products[i].laboratory.nameLaboratory,
                image: products[i].image
            }
        }
        }
        return {"products":info,"success":true}
    }

    async createProduct(infoProduct:CreateProduct){
        try {
            const productFound = await this.getProduct({"nameProduct":infoProduct.nameProduct,
                "laboratory":infoProduct.laboratory})
            if(productFound.product==null){
                if(infoProduct.quantity>0){
                    const checkProduct = await this.getProductForCod(infoProduct.codProduct)
                    if(checkProduct==null){
                        const supplier = await this.supplierService.getSupplier(infoProduct.nameSupplier)
                        if(supplier!=null){
                            const laboratory = await this.laboratoryService.getLaboratory(infoProduct.laboratory)
                            if(this.checkLaboratory(supplier.nit,laboratory)){
                                const product = {
                                    codProduct:infoProduct.codProduct,
                                    nameProduct: this.formatNames(infoProduct.nameProduct).trim(),
                                    describeProduct:infoProduct.describeProduct,
                                    price:infoProduct.priceSell,
                                    laboratory: laboratory,
                                    image:infoProduct.image
                                }   
                                const newProduct = this.productRepository.create(product)
                                await this.productRepository.save(newProduct)
                                await this.lotService.createLot({"codLot":infoProduct.codLot,"userName":infoProduct.userName})
                                const productLot:CreateProductsLot = {
                                    "codProduct":infoProduct.codProduct,
                                    "codLot": infoProduct.codLot,
                                    "expirationDate":infoProduct.expirationDate,
                                    "price":infoProduct.priceBuy,
                                    "quantity":infoProduct.quantity,
                                    "availability":true
                                }
                                const productsSupplier:CreateProductsSupplierDto = {
                                    "nit":supplier.nit,
                                    "codProduct":infoProduct.codProduct
                                }
                                this.productsSupplierService.createProductsSupplier(productsSupplier)
                                return await this.productLotService.createProductLot(productLot),{"success":true}  
                            }else{
                                return HttpStatus.BAD_REQUEST,{"warning":"Este laboratorio no esta asociado al proveedor especificado",
                                    "success":false}
                            }
                        }else{
                            return HttpStatus.BAD_REQUEST,{"warning":"El proveedor no esta registrado en el sistema",
                                "success":false}
                        }   
                    }else{
                        return HttpStatus.BAD_REQUEST,{"warning":"El codigo de producto que ingresaste ya esta asociado a un producto",
                            "success":false}
                    }    
                }else{
                    return HttpStatus.BAD_REQUEST,{"warning":"La cantidad del producto no puede ser 0","success":false}
                }
            }else{
                const checkProduct = await this.getProductForCod(productFound.product.codProduct)
                if(checkProduct!=null){
                    const checkLot = await this.lotService.getLot(infoProduct.codLot)
                    if(checkLot==null){
                        const supplier = await this.supplierService.getSupplier(infoProduct.nameSupplier)
                        if(supplier!=null){
                            const laboratory = await this.laboratoryService.getLaboratory(infoProduct.laboratory)
                            if(this.checkLaboratory(supplier.nit,laboratory)){
                                if(this.checkProductSupplier(supplier.nit,productFound.product)){
                                    await this.lotService.createLot({"codLot":infoProduct.codLot})
                                    productFound.product.price = infoProduct.priceSell
                                    productFound.product.describeProduct = infoProduct.describeProduct
                                    this.productRepository.save(productFound.product)
                                    const productLot:CreateProductsLot = {
                                        "codProduct":checkProduct.codProduct,
                                        "codLot": infoProduct.codLot,
                                        "expirationDate":infoProduct.expirationDate,
                                        "price":infoProduct.priceBuy,
                                        "quantity":infoProduct.quantity,
                                        "availability":true
                                    }
                                    return await this.productLotService.createProductLot(productLot),{"success":true}
                                }
                            }
                        }
                    }else{
                        return HttpStatus.BAD_REQUEST,{"warning":"El lote que va a ingresar ya se encuentra registrado","success":false}
                    }
                }else{
                    return HttpStatus.BAD_REQUEST,{"warning":"Verifica el codigo del producto","success":false}
                }
            }
        } catch (error) {
            return {"success":false}
        }
    }

    async updateProduct(codProduct,infoUpdate:UpdateProduct){
        try {
            const updateProduct = {
                "nameProduct":infoUpdate.nameProduct,
                "describeProduct":infoUpdate.describeProduct,
                "price":infoUpdate.priceSell,
                "laboratory": await this.laboratoryService.getLaboratory(infoUpdate.laboratory),
                "image":infoUpdate.image
            }
            return await this.productRepository.update(codProduct,updateProduct)
        } catch (error) {
            return {"success":false}
        }
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

    async checkLaboratory(nit,laboratory:Laboratory){
        const laboratoriesSupplier = await this.laboratorySuppliersService.getLaboratorySupplierForNit(nit)
        for(let i=0;i<laboratoriesSupplier.length;i++){
            if(laboratory.nameLaboratory==laboratoriesSupplier[i].laboratory.nameLaboratory){
                return true
            }
        }
        return false
    }

    async checkProductSupplier(nit,product:Product){
        const productSupplier = await this.productsSupplierService.getProductsSupplierForNit(nit)
        for(let i=0;i<productSupplier.length;i++){
            if(product.codProduct==productSupplier[i].codProduct){
                return true
            }
        }
        return false
    }

    async createLotWithOder(infoProduct:ProductsRecive,priceBuy,codOrder,userName){
        try {
            const productFound = await this.getProduct({"nameProduct":infoProduct.nameProduct,
                "laboratory":infoProduct.laboratory})
            const checkProduct = await this.getProductForCod(productFound.product.codProduct)
            if(checkProduct!=null){
                const checkLot = await this.lotService.getLot(infoProduct.codLot)
                if(checkLot==null){
                    await this.lotService.createLotOrder({"codLot":infoProduct.codLot,"codOrder":codOrder,"userName":userName})
                    productFound.product.price = infoProduct.price
                    this.productRepository.save(productFound.product)
                    const productLot:CreateProductsLot = {
                        "codProduct":checkProduct.codProduct,
                        "codLot": infoProduct.codLot,
                        "expirationDate":infoProduct.expirationDate,
                        "price":priceBuy,
                        "quantity":infoProduct.quantity,
                        "availability":true
                    }
                    return await this.productLotService.createProductLot(productLot),{"success":true}
                }
            }
        } catch (error) {
            return {"success":false}   
        }
    }

}  