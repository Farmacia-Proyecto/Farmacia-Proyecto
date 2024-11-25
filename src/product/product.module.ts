import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductslotModule } from '../productsLot/productslot.module';
import { LotModule } from 'src/lot/lot.module';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';
import { LaboratorysuppliersModule } from 'src/laboratorysuppliers/laboratorysuppliers.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { ProductssupplierModule } from 'src/productssupplier/productssupplier.module';


@Module({
  imports:[TypeOrmModule.forFeature([Product]), ProductslotModule, LotModule,
  LaboratoryModule,LaboratorysuppliersModule,SuppliersModule,ProductssupplierModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
