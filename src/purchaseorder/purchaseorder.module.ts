import { Module } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';
import { PurchaseorderController } from './purchaseorder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports:[TypeOrmModule.forFeature([PurchaseOrder]),ProductModule],
  providers: [PurchaseorderService],
  controllers: [PurchaseorderController],
  exports:[PurchaseorderService]
})
export class PurchaseorderModule {}
