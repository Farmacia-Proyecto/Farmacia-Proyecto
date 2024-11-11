import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-password-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUser } from './dto/auth-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepository:Repository<User>
    ){}

    getUsers(){
        return this.userRepository.find()
    }

    getUser(userName){
        return this.userRepository.findOne({
            where:{
                userName:userName
            }
        })
    }

    async createUser(userDto: CreateUserDto){
        console.log(userDto.person.namePerson)
        let userName = userDto.person.namePerson.split(" ")[0].concat(userDto.person.lastNamePerson.split(" ")[0])
        
        let userFound = await this.getUser(userName)
        let suffix = 1
        
        while (userFound) {
            userName = userDto.person.namePerson.split(" ")[0].concat(userDto.person.lastNamePerson.split(" ")[0]).concat(suffix.toString())
            userFound = await this.getUser(userName);
            suffix++;
          }
        const user:User= {
            "userName": userName,
            "password": this.generarContrasena(),
            "typeUser": userDto.typeUser,
            "state": true
        };
        const newUser = this.userRepository.create(user)

        return this.userRepository.save(newUser)
    }

    updateUser(userName: string,password:UpdateUserDto){
        return this.userRepository.update({userName},password)
    }

    checkUser(user:AuthUser){
        return this.userRepository.findOne({
            where:{
                userName:user.userName,
                password:user.password
            }
        })
    }

    generarContrasena(): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let contrasena = '';
        for (let i = 0; i < 10; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          contrasena += caracteres[indiceAleatorio];
        }
        return contrasena;
      }
}

