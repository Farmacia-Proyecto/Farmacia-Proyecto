import { Injectable } from '@nestjs/common';
import { Person } from './person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { infoPerson } from './dto/create-person.dto';
import { infoUsers } from 'src/user/dto/get-users.dto';
import { User } from 'src/user/user.entity';
import { loadEnvFile } from 'process';

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

    async createPerson(infoPerson: infoPerson){
        console.log(infoPerson.namePerson)
        const person = {
            "typeDocument":infoPerson.typeDocument,
            "document":infoPerson.document,
            "namePerson":infoPerson.namePerson,
            "lastNamePerson":infoPerson.lastNamePerson,
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
                "userName":users[i].user.userName,
                "fullName":users[i].namePerson.concat(" " + users[i].lastNamePerson),
                "email":users[i].email,
                "typeUser":users[i].user.typeUser
            }
            i++
        }
        return infoUser;
    }

}
