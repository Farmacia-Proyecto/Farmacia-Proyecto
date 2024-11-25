import { Module } from '@nestjs/common';
import { ProductssupplierController } from './productssupplier.controller';
import { ProductssupplierService } from './productssupplier.service';

@Module({
  controllers: [ProductssupplierController],
  providers: [ProductssupplierService]
})
export class ProductssupplierModule {}
