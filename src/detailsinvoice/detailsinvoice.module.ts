import { Module } from '@nestjs/common';
import { DetailsinvoiceController } from './detailsinvoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailsInvoice } from './detailsinvoice.entity';
import { DetailsinvoiceService } from './detailsinvoice.service';

@Module({
  imports:[TypeOrmModule.forFeature([DetailsInvoice])],
  controllers: [DetailsinvoiceController],
  providers: [DetailsinvoiceService],
  exports:[DetailsinvoiceService]
})
export class DetailsinvoiceModule {}
