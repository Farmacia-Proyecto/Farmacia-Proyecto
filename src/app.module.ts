import { Module } from '@nestjs/common';
import { PersonModule } from './person/person.module';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { LoginService } from './login/login.service';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './login/constants';
import { ProductModule } from './product/product.module';
import { LotModule } from './lot/lot.module';
import { EmailModule } from './email/email.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { PurchaseorderModule } from './purchaseorder/purchaseorder.module';
import { ProductslotModule } from './productsLot/productslot.module';
import { InvoiceController } from './invoice/invoice.controller';
import { InvoiceService } from './invoice/invoice.service';
import { InvoiceModule } from './invoice/invoice.module';
import { DetailsinvoiceService } from './detailsinvoice/detailsinvoice.service';
import { DetailsinvoiceModule } from './detailsinvoice/detailsinvoice.module';

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
      //synchronize: true
    }),
    JwtModule.register({
      global: true,
      secret : jwtConstants.secret,
      signOptions: {expiresIn:"8h"}
    }),
    UserModule,PersonModule,LoginModule, ProductslotModule,ProductModule, 
    LotModule, EmailModule, LaboratoryModule, PurchaseorderModule, InvoiceModule, DetailsinvoiceModule],
  providers: [LoginService],
  controllers: [LoginController],
})
export class AppModule {}
