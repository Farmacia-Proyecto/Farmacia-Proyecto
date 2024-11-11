import { Body, Controller, Post } from '@nestjs/common';
import { AuthUser } from 'src/user/dto/auth-user.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {

    constructor(private loginService:LoginService){}

    @Post()
    async authUser(@Body() user:AuthUser){
        return await this.loginService.authUser(user)
    }
}
