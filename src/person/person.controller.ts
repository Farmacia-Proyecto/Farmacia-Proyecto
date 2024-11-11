import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { PersonService } from "./person.service";
import { Person } from "./person.entity";
import { AuthGuard } from "src/login/login.guard";
import { infoPerson } from "./dto/create-person.dto";

@Controller('/person')
//@UseGuards(AuthGuard)
export class PersonController{

    constructor(private personService: PersonService){
        this.personService = personService
    }

    @Get()
    async getInfoUser(){
       return this.personService.getInfoUser();
    }

    @Get(':document')
    async getPerson(@Param('document', ParseIntPipe) document: number){
       return await this.personService.getPerson(document);
    }

    @Post()
    async createPerson(@Body() person: infoPerson){
        return await this.personService.createPerson(person);
    }
    
    @Patch(':document')
    async updatePerson(@Param('document',ParseIntPipe) document: number, @Body() person){
        return await this.personService.updatePerson(document,person);
    }
}