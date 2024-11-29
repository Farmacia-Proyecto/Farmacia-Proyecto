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
                "laboratories": await this.NamesLaboratories(providersList[i].nit)
            }
        }
        return {"providers": info ,"success":true}
    }

    async NamesLaboratories(nit){
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
                "nameSupplier":this.formatNames(infoSupplier.nameSupplier).trim(),
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
            "nameSupplier":this.formatNames(info.nameSupplier).trim(),
            "phoneSupplier":info.phoneSupplier,
            "emailSupplier":info.emailSupplier
        }
        this.updateLaboratoriesPartners(nit,info.laboratories)
        return this.supplierRepository.update(nit,supplier),{"success":true}
    }

    async updateLaboratoriesPartners(nit,laboratories:CreateLaboratoryDto[]){
        await this.laboratorySuppliersService.deleteLaboratorySupplier(nit)
        await this.addLaboratories(nit,laboratories)
    }


    async addLaboratories(nit,laboratories:CreateLaboratoryDto[]){
        for(let i=0;i<laboratories.length;i++){
            const laboratoryFound = await this.laboratoryService.getLaboratory(laboratories[i].nameLaboratory)
            if(laboratoryFound==null){
                await this.laboratoryService.createLaboratory(laboratories[i].nameLaboratory)
                const laboratory = await this.laboratoryService.getLaboratory(laboratories[i].nameLaboratory)
                this.laboratorySuppliersService.addLaboratorySupplier({"codLaboratory":laboratory.codLaboratory,"nit":nit})
            }else{
                this.laboratorySuppliersService.addLaboratorySupplier({"codLaboratory":laboratoryFound.codLaboratory,"nit":nit})
            }
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

}
