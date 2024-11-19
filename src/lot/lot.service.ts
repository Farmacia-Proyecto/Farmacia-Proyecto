import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { Repository } from 'typeorm';
import { CreateLot } from './dto/create-lot.dto';

@Injectable()
export class LotService {

    constructor(@InjectRepository(Lot) private lotRepository:Repository<Lot>){}

    getLots(){
        return this.lotRepository.find()
    }

    getLot(codLot){
        return this.lotRepository.findOne({
            where:{
                codLot:codLot
            }
        })}


    async createLot(infoLot:CreateLot){
        const lotFound = await this.getLot(infoLot.codLot)
        if(lotFound==null){

            return this.lotRepository.create(infoLot) 
        }
    }

    
}
