import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Laboratory } from './laboratory.entity';
import { Repository } from 'typeorm';
import { CreateLaboratoryDto, UpdateLaboratoryDto } from './dto/create-laboratory.dto';

@Injectable()
export class LaboratoryService {

    constructor(@InjectRepository(Laboratory) private laboratoryRepository:Repository<Laboratory>){}

    getLaboratories(){
        return this.laboratoryRepository.find()
    }

    getLaboratory(nameLaboratory){
        return this.laboratoryRepository.findOne({
            where:{
                nameLaboratory: nameLaboratory
            }
        })
    }

    async searchLaboratory(nameLaboratory){
        return await this.laboratoryRepository.createQueryBuilder('laboratory')
            .where('laboratory.nameLaboratory LIKE :nameLaboratory', { namePerson: `%${nameLaboratory}%` })
            .getMany();
    }

    createLaboratory(infoLaboratory:CreateLaboratoryDto){
        const laboratoryFound = this.getLaboratory(infoLaboratory.nit);
        if(laboratoryFound==null){
            const newLaboratory = this.laboratoryRepository.create(infoLaboratory);
            return this.laboratoryRepository.save(newLaboratory),{"success":true};
        }
        return {"success":false}
    }

    updateLaboratory(nit,infoLaboratory:UpdateLaboratoryDto){
        return this.laboratoryRepository.update(nit,infoLaboratory),{"success":true}
    }

    
}
