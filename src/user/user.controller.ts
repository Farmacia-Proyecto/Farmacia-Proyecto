import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-password-user.dto';
import { AuthGuard } from 'src/login/login.guard';

@Controller('/user')
//@UseGuards(AuthGuard)
export class UserController {

    constructor(private userService: UserService){}

    @Post()
    createUser(@Body() user:CreateUserDto){
        return this.userService.createUser(user);
    }

    @Get()
    getUsers(){
        return this.userService.getUsers()
    }

    @Get(':userName')
    getUser(@Param('userName') userName){
        return this.userService.getUser(userName)
    }

    @Put()
    updateUser(@Body() info:UpdateUserPasswordDto){
        return this.userService.updatePassword(info)
    }

    @Patch("/recovery")
    recoveryPassword(@Body() info:UpdateUserPasswordDto){
        return this.userService.recoveryPasswordUser(info)
    }
}
