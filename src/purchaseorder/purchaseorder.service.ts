import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateOrder, FormatGetOrders, InProgrees, Recive } from './dto/pucharseorder.dto';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { PersonService } from 'src/person/person.service';
import { CreateOrderDetails } from 'src/orderdetails/dto/orderdetails.dto';
import { OrderdetailsService } from 'src/orderdetails/orderdetails.service';
import { infoProductCotizacion } from 'src/email/dto/send-email.dto';
import { AlertMinStock, infoGetProductOrders } from 'src/product/dto/create-product.dto';
import { LaboratorySuppliers } from 'src/laboratorysuppliers/laboratorysuppliers.entity';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { LaboratorysuppliersService } from 'src/laboratorysuppliers/laboratorysuppliers.service';
import { ProductslotService } from 'src/productsLot/productslot.service';
import { LotService } from 'src/lot/lot.service';

@Injectable()
export class PurchaseorderService {

    constructor(@InjectRepository(PurchaseOrder) private purchaseOrderRepository:Repository<PurchaseOrder>,
    @Inject(forwardRef(()=>ProductService)) private productService:ProductService,
    private laboratoryService:LaboratoryService,
    private laboratorySupplierService:LaboratorysuppliersService,
    private supplierService:SuppliersService,
    private personService:PersonService,
    private orderDetailsService:OrderdetailsService,
    private productLotService:ProductslotService
    ){}

    async getOrders(){
       return await this.formatGetOrders()
    }

    async formatGetOrders(){
        try {
            const orders = await this.purchaseOrderRepository.find({
                relations:['supplier'],
                order:{orderDate:"ASC"}
            })
            const format:FormatGetOrders[] = []
            for(let i=0;i<orders.length;i++){
                const formatProducts:infoGetProductOrders[] = []
                const details = orders[i].orderDetails
                for(let j=0;j<details.length;j++){
                    formatProducts[j]= {
                        "nameProduct":(await this.productService.getProductForCod(details[j].codProduct)).nameProduct,
                        "laboratory": (await this.productService.getProductForCod(details[j].codProduct)).laboratory.nameLaboratory,
                        "quantity":details[j].quantity,
                        "price":details[j].price
                    }
                }
                format[i] = {
                    "codOrder":orders[i].codOrder,
                    "nameSupplier":orders[i].supplier.nameSupplier,
                    "dateRegister":orders[i].orderDate,
                    "state":orders[i].state,
                    "products": formatProducts
                }
            }
            return {"orders":format,"success":true}
        } catch (error) {
            return {"success":false}
        }
    }

    getOrder(corOrder){
        return this.purchaseOrderRepository.findOne({
            where:{
                codOrder:corOrder
            }
        })
    }

    async createOrder(orders:CreateOrder[]){
        try {
            const date = new Date()
            const supliers = this.selectSuppliers(orders)
            const person = await this.personService.searchPersonByUserName(orders[0].userName)
            for(let i=0;i<supliers.length;i++){
                const details:CreateOrderDetails[] = []
                const productEmail:infoProductCotizacion[] = []
                const codOrder = await this.generatedCodOrder()
                for(let j=0;j<orders.length;j++){
                    if(supliers[i]===orders[j].nameSupplier){
                        const product = await this.productService.getProduct({"nameProduct":orders[j].nameProduct,
                            "laboratory":orders[j].laboratory})
                            details[details.length]={
                            "codOrder": codOrder,
                            "codProduct": product.product.codProduct,
                            "quantity": orders[j].quantity,
                        }
                        productEmail[productEmail.length] = {
                            "codProduct": product.product.codProduct,
                            "nameProduct":product.product.nameProduct,
                            "quantity":orders[j].quantity
                        }
                    }
                }
                const order = this.purchaseOrderRepository.create({
                    "codOrder":codOrder,
                    "orderDate":date,
                    "supplier": await this.supplierService.getSupplier(orders[i].nameSupplier),
                    "person": person,
                    "state": "Enviada"
                })
                await this.purchaseOrderRepository.save(order)
                this.orderDetailsService.createOrderDetails(details)
                this.personService.sendCotizacion({"products":productEmail,
                    "name":(person.namePerson +" "+person.lastNamePerson),
                    "phone":person.phone, "email": person.email,
                    "supplier":orders[i].nameSupplier,"typeUser":person.user.typeUser,"emailSupplier":order.supplier.emailSupplier})
            }
            return {"success":true}
        } catch (error) {
            return HttpStatus.BAD_REQUEST,{"success":false}
        }
    }

    selectSuppliers(orders:CreateOrder[]){
        const suppliers = []
        for(let i =0;i<orders.length;i++){
            if(!suppliers.includes(orders[i].nameSupplier)){
                suppliers[suppliers.length]=orders[i].nameSupplier
            }
        }
        return suppliers
    }

    getOrderInStateEnvOrPro(){
            return this.purchaseOrderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderDetails', 'orderDetails')
        .where('order.state IN (:...states)', { states: ['Enviada', 'En progreso']})
        .getMany();
    }


    async generatedCodOrder(){
        const size = await this.purchaseOrderRepository.find()
        return  size.length + 1
    }

    async generatedAlertMinStock(){
        const products = await this.productService.getProducts()
        const productAlert:AlertMinStock[] = []
        for(let i=0;i<products.products.length;i++){
            let productLot = await this.productLotService.getProductLotsForCod(products.products[i].codProduct)
            let totalQuantity = 0;
            for(let j=0;j<productLot.length;j++){
                totalQuantity += productLot[j].quantity
            }
            if(totalQuantity<=10){
                if(await this.checkRelacionOrderAlert(products.products[i].codProduct)){
                    productAlert[productAlert.length]={
                        "codProduct":products.products[i].codProduct,
                        "nameProduct":products.products[i].nameProduct,
                        "laboratory": products.products[i].laboratory,
                        "quantity": totalQuantity
                    }
                }
            }
        }
        if(productAlert.length==0){
            return {"success":false}
        }else{
            return {"products":productAlert,"success":true}
        }
    }

    async checkRelacionOrderAlert(codProduct){
        try {
            const orders = await this.getOrderInStateEnvOrPro()
            for(let i=0;i<orders.length;i++){
                const details = orders[i].orderDetails
                for(let j=0;j<details.length;j++){
                    if(details[j].codProduct==codProduct){
                        return false
                    }
                }
            }
            return true
        } catch (error) {
            return false   
        }
    }

    async acceptViewOrder(){
        try {
            const products = await this.generatedAlertMinStock()
            const productOrder = []
            if(products.success){
                for(let i =0;i<products.products.length;i++){
                    const product = await this.productService.getProduct({"nameProduct":products.products[i].nameProduct,
                        "laboratory":products.products[i].laboratory})
                    productOrder[i] = {
                        "nameProduct":product.product.nameProduct,
                        "laboratory":product.product.laboratory.nameLaboratory,
                        "suppliers": await this.searchSuppliersProduct(product.product.laboratory.nameLaboratory)
                    }
                }
                return {"products":productOrder,"success":true}
            }else{
                return {"success":false}
            }
        } catch (error) {
            return {"success":false}   
        }
    }

    async searchSuppliersProduct(nameLaboratory){
        const lab = await this.laboratoryService.getLaboratory(nameLaboratory)
        const suppliers:LaboratorySuppliers[] = await this.laboratorySupplierService.getLaboratorySupplierForCodLaboratory(lab.codLaboratory)
        const nameSuppliers = []
        for(let i=0;i<suppliers.length;i++){
            nameSuppliers[i] = {
                "nameSupplier":suppliers[i].supplier.nameSupplier
            }
        }
        return nameSuppliers
    }

    async changeStateInProgress(codOrder,info:InProgrees){
        try {
            if(info.state==="En progreso"){
                const order = await this.getOrder(codOrder)
                const details = order.orderDetails
                for(let i=0;i<details.length;i++){
                    for(let j=0;j<info.products.length;j++){
                        const product = await this.productService.getProduct({"nameProduct":info.products[j].nameProduct,
                            "laboratory":info.products[j].laboratory})
                        if(details[i].codProduct==product.product.codProduct){
                            this.orderDetailsService.updateOrderDetails(codOrder,product.product.codProduct,
                                info.products[j].price,info.products[j].quantity)
                        }
                    }
                }
                this.purchaseOrderRepository.update(codOrder,{state:info.state})
                this.orderDetailsService.updateOrderInProgess(codOrder)
                return {"success":true}
            }else{
                const isEmpty = (str: string) => !str || str.trim().length === 0;

                if (isEmpty(info.state)) {
                    return {"succes":false} 
                }else{
                    this.purchaseOrderRepository.update(codOrder,{state:info.state})
                    return {"success":true}
                }
            }
        } catch (error) {
            return {"succes":false}   
        }
    }

    async changeStateRecive(codOrder,info:Recive){
        try {
            this.orderDetailsService.checkOrderRecive(codOrder,info.products)
            for(let i=0;i<info.products.length;i++){
                const product = await this.productService.getProduct({"nameProduct":info.products[i].nameProduct,
                    "laboratory":info.products[i].laboratory
                })
                const detailOrder = this.orderDetailsService.searchOrderDetails(codOrder,product.product.codProduct)
                this.productService.createLotWithOder(info.products[i],(await detailOrder).price,codOrder,info.userName)
            }
            this.purchaseOrderRepository.update(codOrder,{state:info.state})
            return {"success":true}
        } catch (error) {
            return {"success":false}
        }   
    }

}
