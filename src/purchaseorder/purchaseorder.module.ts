import { Module } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';
import { PurchaseorderController } from './purchaseorder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PurchaseOrder])],
  providers: [PurchaseorderService],
  controllers: [PurchaseorderController],
  exports:[PurchaseorderService]
})
export class PurchaseorderModule {}
