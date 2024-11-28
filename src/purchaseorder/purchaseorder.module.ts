import { forwardRef, Module } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';
import { PurchaseorderController } from './purchaseorder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';
import { ProductModule } from 'src/product/product.module';
import { PersonModule } from 'src/person/person.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';

@Module({
  imports:[TypeOrmModule.forFeature([PurchaseOrder]),
  forwardRef(() => ProductModule),PersonModule,SuppliersModule],
  providers: [PurchaseorderService],
  controllers: [PurchaseorderController],
  exports:[PurchaseorderService]
})
export class PurchaseorderModule {}
