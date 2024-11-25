import { Injectable } from '@nestjs/common';
import { AddLaboratorySupplier } from './dto/laboratorysupplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LaboratorySuppliers } from './laboratorysuppliers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LaboratorysuppliersService {

    constructor(@InjectRepository(LaboratorySuppliers) private laboratorySupplierRepository:Repository<LaboratorySuppliers>){}

    getLaboratorySupplier(){
        return this.laboratorySupplierRepository.find()
    }

    async getLaboratorySupplierForNit(nit){
        const laboratorySuppliers = await this.laboratorySupplierRepository.find({
            where: { nit },
            relations: ['laboratory'],
        });
        return laboratorySuppliers
    }

    deleteLaboratorySupplier(nit){
        this.laboratorySupplierRepository.delete({ supplier: { nit } });
    }

    addLaboratorySupplier(infoLaboratorySupplier:AddLaboratorySupplier){
        console.log("Agregando a la entidad debil")
        console.log(infoLaboratorySupplier)
        const newlaboratorySupplier = this.laboratorySupplierRepository.create(infoLaboratorySupplier)
        this.laboratorySupplierRepository.save(newlaboratorySupplier)
        return {"success":true}
    }

}
