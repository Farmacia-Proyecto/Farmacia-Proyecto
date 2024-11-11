import { HttpException, Injectable } from '@nestjs/common';
import { AuthUser } from 'src/user/dto/auth-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async authUser(user:AuthUser){
        const userfound = await this.userService.checkUser(user)
        if(!userfound) 
            return new HttpException("Acceso denegado",400)
        const payload = {userName:userfound.userName,typeUser:userfound.typeUser}
        return this.generateToken(payload);
    }

    async generateToken(payload){
        const token = await this.jwtService.signAsync(payload)
        return {"token":token}
    }
}
