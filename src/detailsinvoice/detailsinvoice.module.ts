import { Module } from '@nestjs/common';
import { DetailsinvoiceController } from './detailsinvoice.controller';

@Module({
  controllers: [DetailsinvoiceController]
})
export class DetailsinvoiceModule {}
