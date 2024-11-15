import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { PersonService } from "./person.service";
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

    @Post("/search")
    async getPerson(@Body() person){
       return await this.personService.searchPerson(person)
    }

    @Post()
    async createPerson(@Body() person: infoPerson){
        return await this.personService.createPerson(person);
    }
    
    @Put(':document')
    async updatePerson(@Param('document',ParseIntPipe) document: number, @Body() person){
        return await this.personService.updatePerson(document,person);
    }

    @Patch(':document')
    async updateUser(@Param('document',ParseIntPipe) document: number, @Body() user){
        return await this.personService.updateStateUser(document,user)
    }

    @Post("/recover-password")
    async recovery(@Body() userName){
        return await this.personService.recoveryPassword(userName)
    }
}