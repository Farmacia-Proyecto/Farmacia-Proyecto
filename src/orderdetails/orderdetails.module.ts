import { Module } from '@nestjs/common';
import { OrderdetailsController } from './orderdetails.controller';

@Module({
  controllers: [OrderdetailsController]
})
export class OrderdetailsModule {}
