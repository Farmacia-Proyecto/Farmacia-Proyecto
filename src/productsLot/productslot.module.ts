import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductslotService } from './productslot.service';
import { ProductsLot } from './productlot.entity';
import { ProductslotController } from './productslot.controller';

@Module({
  imports:[TypeOrmModule.forFeature([ProductsLot])],
  providers: [ProductslotService],
  exports:[ProductslotService],
  controllers: [ProductslotController]
})
export class ProductslotModule {}
