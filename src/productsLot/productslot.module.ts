import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductslotService } from './productslot.service';
import { ProductsLot } from './productlot.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductsLot])],
  providers: [ProductslotService],
  exports:[ProductslotService]
})
export class ProductslotModule {}
