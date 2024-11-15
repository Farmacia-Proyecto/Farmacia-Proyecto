import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Person } from './person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { infoPerson } from './dto/create-person.dto';
import { SearchPerson } from './dto/search-person.dto';
import { UpdateUserDto } from 'src/user/dto/update-password-user.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PersonService {

    constructor(@InjectRepository(Person) private personRepository: Repository<Person>,
                private userService: UserService,
                private emailService:EmailService
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

    async searchPerson(person:SearchPerson){
        if(person.namePerson){
            const persons = await this.personRepository.createQueryBuilder('person')
            .where('person.namePerson LIKE :namePerson', { namePerson: `%${person.namePerson}%` })
            .orWhere('person.lastNamePerson LIKE :lastNamePerson', {lastNamePerson: `%${person.namePerson}%`})
            .getMany();
            let i =0;
            let info = []
            while(i<persons.length){
                info[i]= {
                    "document":persons[i].document,
                    "name":persons[i].namePerson,
                    "lastName":persons[i].lastNamePerson,
                    "email":persons[i].email,
                    "typeUser": (await this.getPerson(persons[i].document)).user.typeUser,
                    "state": this.getStateUser((await this.getPerson(persons[i].document)).user.state)
                }
                i++
            }
            return {"users":info,"success":true}
        }
    }

    async createPerson(infoPerson: infoPerson){
        const personFound = await this.getPerson(infoPerson.document)
        if(personFound==null){
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
            this.emailService.sendEmailRegister({userName:user.userName,password:user.password,email:person.email})
            return await this.personRepository.save(newPerson),HttpStatus.CREATED,{"success":true}
        }
        return HttpStatus.NOT_ACCEPTABLE,{"success":false}
    }

    updatePerson(document: number, person){
        return this.personRepository.update({document},person),HttpStatus.ACCEPTED,{"success":true}
    }

    async updateStateUser(document:number,user:UpdateUserDto){
        const doc = await this.getPerson(document)
        return this.userService.updateUser(doc.user.userName,user),HttpStatus.ACCEPTED,{"success":true}
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
        return HttpStatus.ACCEPTED,{"users":infoUser,"success":true};
    }

    getStateUser(state){
        if(state){
            return "ACTIVO"
        }
        return "INACTIVO"
    }

    async recoveryPassword(info:UpdateUserDto){
        const user = await this.userService.getUser(info.userName)
        const person = await this.personRepository.findOne({
            where:{
                user:user
            }
        })
        if(person!=null){
            this.emailService.sendEmailRecovery({userName:info.userName,email:person.email})
            const email = person.email
            return HttpStatus.ACCEPTED,{
                "email": email ,
                "success":true
            }
        }
        return HttpStatus.BAD_REQUEST,{"success":false}
    }
}
