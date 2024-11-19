import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Laboratory } from './laboratory.entity';
import { Repository } from 'typeorm';
import { CreateLaboratoryDto, SearchLaboratory, UpdateLaboratoryDto } from './dto/create-laboratory.dto';

@Injectable()
export class LaboratoryService {

    constructor(@InjectRepository(Laboratory) private laboratoryRepository:Repository<Laboratory>){}

    async getLaboratories(){
        return {"laboratory": await this.laboratoryRepository.find(),"success":true}
    }

    getLaboratory(nameLaboratory){
        return this.laboratoryRepository.findOne({
            where:{
                nameLaboratory: nameLaboratory
            }
        })
    }

    async searchLaboratory(nameLaboratory:SearchLaboratory){
        return {"laboratory":await this.laboratoryRepository.createQueryBuilder('laboratory')
            .where('laboratory.nameLaboratory LIKE :nameLaboratory', { nameLaboratory: `%${nameLaboratory.nameLaboratory}%` })
            .getMany(),"success":true};
    }

    async gatNamesLaboratories(){
        const laboratories = await this.laboratoryRepository.find()
            let i =0;
            let info = []
            while(i<laboratories.length){
                info[i]= {
                    "nameLaboratoy":laboratories[i].nameLaboratory
                }
                i++
            }
            return {"laboratory":info,"success":true}
    }


    createLaboratory(infoLaboratory:CreateLaboratoryDto){
        const laboratoryFound = this.getLaboratory(infoLaboratory.nit);
            const newLaboratory = this.laboratoryRepository.create(infoLaboratory);
            return this.laboratoryRepository.save(newLaboratory),{"success":true};
    }

    async updateLaboratory(nit,infoLaboratory:UpdateLaboratoryDto){
        return await this.laboratoryRepository.update(nit,infoLaboratory),{"success":true}
    }

    
}
