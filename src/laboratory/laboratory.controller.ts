import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { CreateLaboratoryDto, UpdateLaboratoryDto } from './dto/create-laboratory.dto';

@Controller('laboratory')
export class LaboratoryController {

    constructor(private laboratoryService:LaboratoryService){}

    @Get()
    getLaboratories(){
        return this.laboratoryService.getLaboratories()
    }

    @Get(':nit')
    getLaboratory(@Param("nit",ParseIntPipe) nit:number){
        return this.laboratoryService.getLaboratory(nit)
    }

    @Post("/search")
    searchLaboratory(@Body() nameLaboratory){
        return this.laboratoryService.searchLaboratory(nameLaboratory)
    }

    @Post()
    createLaboratory(@Body() infoLaboratory:CreateLaboratoryDto){
        return this.laboratoryService.createLaboratory(infoLaboratory)
    }

    @Put(':nit')
    updateLaboratory(@Param("nit",ParseIntPipe) nit:number,@Body() infoUpdateLaboratory:UpdateLaboratoryDto){
        return this.laboratoryService.updateLaboratory(nit,infoUpdateLaboratory)
    }

}


