import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './supliers.entity';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/supplier.dto';
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
        for(let i =0;i<providersList.length;i++)
            info[i] = {
                "nit":providersList[i].nit,
                "nameSupplier": providersList[i].nameSupplier,
                "phoneSupplier": providersList[i].phoneSupplier,
                "emailSupplier": providersList[i].emailSupplier,
                "laboratories": await this.laboratoryService.searchNamesLaboratorySuppliers(providersList[i].nit,
                    this.laboratorySuppliersService.getLaboratorySupplier())
            }
        return {"providers": info ,"success":true}
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


    async addLaboratories(nit,laboratories:CreateLaboratoryDto[]){
        for(let i=0;i<laboratories.length;i++){
            const laboratoryFound = await this.laboratoryService.getLaboratory(laboratories[i].nameLaboratory)
            console.log(laboratoryFound)
            if(laboratoryFound==null){
                console.log("Agregando un nuevo laboratorio")
                console.log(await this.laboratoryService.createLaboratory(laboratories[i].nameLaboratory))
                this.laboratoryService.createLaboratory(laboratories[i].nameLaboratory)
                const laboratory = await this.laboratoryService.getLaboratory(laboratories[i].nameLaboratory)
                this.laboratorySuppliersService.addLaboratorySupplier({"codLaboratory":laboratory.codLaboratory,"nit":nit})
            }else{
                this.laboratorySuppliersService.addLaboratorySupplier({"codLaboratory":laboratoryFound.codLaboratory,"nit":nit})
            }
        }
    }

}
