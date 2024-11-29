import { Module } from '@nestjs/common';
import { ProductssupplierController } from './productssupplier.controller';
import { ProductssupplierService } from './productssupplier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsSupplier } from './productssupplier.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[TypeOrmModule.forFeature([ProductsSupplier]),EmailModule],
  controllers: [ProductssupplierController],
  providers: [ProductssupplierService],
  exports:[ProductssupplierService]
})
export class ProductssupplierModule {}
