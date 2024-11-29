import { HttpStatus, Injectable } from '@nestjs/common';
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

    async getLaboratory(nameLaboratory){
        return await this.laboratoryRepository.findOne({
            where:{
                nameLaboratory: nameLaboratory
            }
        })
    }

    async getLaboratoryForCod(codLaboratory){
        return await this.laboratoryRepository.findOne({
            where:{
                codLaboratory: codLaboratory
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
                    "nameLaboratory":laboratories[i].nameLaboratory
                }
                i++
            }
            return {"laboratory":info,"success":true}
    }


    async createLaboratory(nameLaboratory){
        const laboratoryFound = await this.getLaboratory(nameLaboratory);
        if(!laboratoryFound){
            const newLaboratory = this.laboratoryRepository.create({"codLaboratory": await this.generatedCodLaboratory(),
                "nameLaboratory":nameLaboratory});
            return await this.laboratoryRepository.save(newLaboratory),{"success":true};   
        }
        return HttpStatus.BAD_REQUEST,{"success":false}
    }

    async updateLaboratory(nit,infoLaboratory:UpdateLaboratoryDto){
        return await this.laboratoryRepository.update(nit,infoLaboratory),{"success":true}
    }

    
    async generatedCodLaboratory(){
        const size = (await this.getLaboratories()).laboratory
        return  size.length + 1
    }
    
}
