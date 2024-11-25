import { Module } from '@nestjs/common';
import { ProductssupplierController } from './productssupplier.controller';
import { ProductssupplierService } from './productssupplier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsSupplier } from './productssupplier.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductsSupplier])],
  controllers: [ProductssupplierController],
  providers: [ProductssupplierService],
  exports:[ProductssupplierService]
})
export class ProductssupplierModule {}
