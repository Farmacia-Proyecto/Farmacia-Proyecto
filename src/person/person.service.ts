import { HttpException, Injectable } from '@nestjs/common';
import { Person } from './person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { infoPerson } from './dto/create-person.dto';
import { SearchPerson } from './dto/search-person.dto';

@Injectable()
export class PersonService {

    constructor(@InjectRepository(Person) private personRepository: Repository<Person>,
                private userService: UserService
    ){}

    getPersons(){
        return this.personRepository.find()
    }

    getPerson(document: number){
        return this.personRepository.findOne({
            where: {
                document:document
            }
        })
    }

    searchPerson(person:SearchPerson){
        if(person.document){
            return this.getPerson(person.document)
        }
        if(person.namePerson){
            return this.personRepository.findOne({
                where:{
                    namePerson:person.namePerson
                }
            })
        }
    }

    async createPerson(infoPerson: infoPerson){
        console.log(infoPerson.namePerson)
        const personFound = this.getPerson(infoPerson.document)
        if(personFound){
            return new HttpException("Esta persona ya se encuentra registrada",409)
        }
        const person = {
            "typeDocument":infoPerson.typeDocument.toUpperCase(),
            "document":infoPerson.document,
            "namePerson":infoPerson.namePerson.toUpperCase(),
            "lastNamePerson":infoPerson.lastNamePerson.toUpperCase(),
            "phone":infoPerson.phone,
            "email":infoPerson.email
        }
        const newPerson = this.personRepository.create(person)
        const user = await this.userService.createUser({"person":newPerson,"typeUser":infoPerson.typeUser})
        newPerson.user = user
       
        return await this.personRepository.save(newPerson)
    }

    updatePerson(document: number, person){
        return this.personRepository.update({document},person)
    }

    async getInfoUser(){
        const users = await this.getPersons()
        let i=0
        let infoUser = []
        while(i < users.length){
            infoUser[i]={
                "document":users[i].document,
                "name":users[i].namePerson,
                "lastName":users[i].lastNamePerson,
                "email":users[i].email,
                "typeUser":users[i].user.typeUser,
                "state": this.getStateUser(users[i].user.state)
            }
            i++
        }
        return {"users":infoUser};
    }

    getStateUser(state){
        if(state){
            return "ACTIVO"
        }
        return "INACTIVO"
    }
}