import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-password-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUser } from './dto/auth-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepository:Repository<User>){}

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

    async recoveryPasswordUser(info:UpdateUserDto){
        const password = info.newPassword;
        return this.userRepository.update(info.userName,{password})
    }

    async updateUser(userName: string,state){
        return this.userRepository.update({userName},state)
    }

    async updatePassword(info:UpdateUserDto){
        const userFound = await this.getUser(info.userName);
        const currentPassword = info.currentPassword;
        const password = info.newPassword;
        if(userFound!=null){
            if(this.checkPassword(currentPassword,userFound.password)){
                return this.userRepository.update(userFound.userName,{password}),HttpStatus.ACCEPTED,{'success':true}
            }
        }
        return HttpStatus.NOT_ACCEPTABLE,{'success':false}
    }

    private checkPassword(passwordSystem,password){
        if(password==passwordSystem){
            return true;
        }
        return false;
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
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let contrasena = '';
        for (let i = 0; i < 10; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          contrasena += caracteres[indiceAleatorio];
        }
        return contrasena;
    }
}

