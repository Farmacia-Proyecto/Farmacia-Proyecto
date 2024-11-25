import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './supliers.entity';
import { Repository } from 'typeorm';
import { CreateSupplierDto, updateSupplier } from './dto/supplier.dto';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { CreateLaboratoryDto } from 'src/laboratory/dto/create-laboratory.dto';
import { LaboratorysuppliersService } from 'src/laboratorysuppliers/laboratorysuppliers.service';

@Injectable()
export class SuppliersService {

    constructor(@InjectRepository(Supplier) private supplierRepository:Repository<Supplier>,
    private laboratoryService:LaboratoryService,
    private laboratorySuppliersService:LaboratorysuppliersService
    ){}

    async getSupliers(){
        const providersList = await this.supplierRepository.find()
        const info = []
        for(let i =0;i<providersList.length;i++){
            
            info[i] = {
                "nit":providersList[i].nit,
                "nameSupplier": providersList[i].nameSupplier,
                "phoneSupplier": providersList[i].phoneSupplier,
                "emailSupplier": providersList[i].emailSupplier,
                "laboratories": await this.formatNamesLaboratories(providersList[i].nit)
            }
        }
        return {"providers": info ,"success":true}
    }

    async formatNamesLaboratories(nit){
        const laboratories = await this.laboratorySuppliersService.getLaboratorySupplierForNit(nit)
        const names = []
        for(let i =0;i<laboratories.length;i++){
            names[i] = {
                "nameLaboratory":laboratories[i].laboratory.nameLaboratory
            }
        }
        return names;
    }

    async getSupplier(nameSupplier){
        return await this.supplierRepository.findOne({
            where:{
                nameSupplier:nameSupplier
            }
        })
    }

    async createSupplier(infoSupplier:CreateSupplierDto){
        try {
            const supplier = {
                "nit":infoSupplier.nit,
                "nameSupplier":infoSupplier.nameSupplier,
                "phoneSupplier":infoSupplier.phoneSupplier,
                "emailSupplier":infoSupplier.emailSupplier
            }
            const newSupplier = this.supplierRepository.create(supplier)
            await this.supplierRepository.save(newSupplier)
            
            this.addLaboratories(infoSupplier.nit,infoSupplier.laboratories)
            return {"success":true}
        } catch (error) {
            return {"warning":"Error al crear el proveedor","success":false}
        }
        
    }

    async updateSupplier(nit,info:updateSupplier){
        const supplier = {
            "nameSupplier":info.nameSupplier,
            "phoneSupplier":info.phoneSupplier,
            "emailSupplier":info.emailSupplier
        }
        this.updateLaboratoriesPartners(nit,info.laboratories)
        return this.supplierRepository.update(nit,supplier),{"success":true}
    }

    async updateLaboratoriesPartners(nit,laboratories:CreateLaboratoryDto[]){
        await this.laboratorySuppliersService.deleteLaboratorySupplier(nit)
        this.addLaboratories(nit,laboratories)
    }


    async addLaboratories(nit,laboratories:CreateLaboratoryDto[]){
        console.log("Laboratorios que llegaron")
        console.log(laboratories)
        console.log()
        for(let i=0;i<laboratories.length;i++){
            const laboratoryFound = await this.laboratoryService.getLaboratory(laboratories[i].nameLaboratory)
            console.log("Laboratorio buscado")
            console.log(laboratoryFound)
            console.log()
            if(laboratoryFound==null){
                console.log("Agregando un nuevo laboratorio")
                console.log()
                await this.laboratoryService.createLaboratory(laboratories[i].nameLaboratory)
                const laboratory = await this.laboratoryService.getLaboratory(laboratories[i].nameLaboratory)
                console.log(laboratory)
                this.laboratorySuppliersService.addLaboratorySupplier({"codLaboratory":laboratory.codLaboratory,"nit":nit})
            }else{
                console.log("Laboratorio que se estan agregando al proveedor" + "  i: " + i)
                console.log(laboratories[i])
                console.log()
                this.laboratorySuppliersService.addLaboratorySupplier({"codLaboratory":laboratoryFound.codLaboratory,"nit":nit})
            }
        }
    }

}
