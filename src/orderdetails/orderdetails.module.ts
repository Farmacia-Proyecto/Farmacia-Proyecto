import { Module } from '@nestjs/common';
import { OrderdetailsController } from './orderdetails.controller';
import { OrderdetailsService } from './orderdetails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './orderdetails.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OrderDetails])],
  controllers: [OrderdetailsController],
  providers:[OrderdetailsService],
  exports:[OrderdetailsService]
})
export class OrderdetailsModule {}
