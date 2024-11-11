import { Module } from '@nestjs/common';
import { PersonModule } from './person/person.module';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { LoginService } from './login/login.service';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './login/constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'pharmacyproject',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    JwtModule.register({
      global: true,
      secret : jwtConstants.secret,
      signOptions: {expiresIn:"8h"}
    }),
    UserModule,PersonModule,LoginModule],
  providers: [LoginService],
  controllers: [LoginController],
})
export class AppModule {}
