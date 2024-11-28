import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';
import { PurchaseorderModule } from 'src/purchaseorder/purchaseorder.module';
import { PersonModule } from 'src/person/person.module';
import { ProductModule } from 'src/product/product.module';

@Module({
    imports:[TypeOrmModule.forFeature([Lot]),PurchaseorderModule, PersonModule],
    providers: [LotService],
    controllers: [LotController],
    exports:[LotService]
  })
export class LotModule {}
