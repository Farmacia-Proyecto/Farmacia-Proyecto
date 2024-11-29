import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';
import { PurchaseorderModule } from 'src/purchaseorder/purchaseorder.module';
import { PersonModule } from 'src/person/person.module';

@Module({
    imports:[TypeOrmModule.forFeature([Lot]),forwardRef(()=>PurchaseorderModule),PersonModule],
    providers: [LotService],
    controllers: [LotController],
    exports:[LotService]
  })
export class LotModule {}
