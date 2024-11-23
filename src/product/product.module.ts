import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductslotModule } from '../productsLot/productslot.module';
import { LotModule } from 'src/lot/lot.module';
import { ProductslaboratoryModule } from 'src/productslaboratory/productslaboratory.module';


@Module({
  imports:[TypeOrmModule.forFeature([Product]), ProductslotModule, LotModule,ProductslaboratoryModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
