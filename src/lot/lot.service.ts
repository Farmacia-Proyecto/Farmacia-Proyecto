import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { Repository } from 'typeorm';
import { CreateLot } from './dto/create-lot.dto';
import { REQUEST } from '@nestjs/core';
import { PersonService } from 'src/person/person.service';
import { PurchaseorderService } from 'src/purchaseorder/purchaseorder.service';

@Injectable()
export class LotService {

    constructor(@InjectRepository(Lot) private lotRepository:Repository<Lot>,
    @Inject(REQUEST) private readonly request: any,
    private personService:PersonService,
    private purchaseOrderService:PurchaseorderService
    ){}

    getLots(){
        return this.lotRepository.find()
    }

    getLot(codLot){
        return this.lotRepository.findOne({
            where:{
                codLot:codLot
            }
        })}


    async createLotOrder(infoLot:CreateLot){
        const date = new Date()
        const lotFound = await this.getLot(infoLot.codLot)
        if(lotFound==null){
            const lot = {
                codLot:infoLot.codLot,
                registerDate:date,
                person: await this.personService.searchPersonByUserName(this.request.user.userName),
                purchaseOrder: await this.purchaseOrderService.getOrder(infoLot.codOrder)
            }
            const newLot = this.lotRepository.create(lot)
            return this.lotRepository.save(newLot)
        };
    }

    async createLot(infoLot:CreateLot){
        const date = new Date()
        const lotFound = await this.getLot(infoLot.codLot)
        const person = await this.personService.searchPersonByUserName(this.request.user.userName)
        if(lotFound==null){
            const lot = {
                codLot:infoLot.codLot,
                registerDate:date,
                person: person
            }
            const newLot = this.lotRepository.create(lot)
            return this.lotRepository.save(newLot)
        };
    }
    
}
