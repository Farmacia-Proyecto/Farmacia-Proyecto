import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-password-user.dto';
import { AuthGuard } from 'src/login/login.guard';

@Controller('/user')
@UseGuards(AuthGuard)
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

    @Patch(':userName')
    updateUser(@Param("userName") userName, @Body() password:UpdateUserDto){
        return this.userService.updateUser(userName,password)
    }
}
