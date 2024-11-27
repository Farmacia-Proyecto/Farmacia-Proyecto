import { Module } from '@nestjs/common';
import { DetailsinvoiceController } from './detailsinvoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailsInvoice } from './detailsinvoice.entity';
import { DetailsinvoiceService } from './detailsinvoice.service';
import { ProductslotModule } from 'src/productsLot/productslot.module';

@Module({
  imports:[TypeOrmModule.forFeature([DetailsInvoice]),ProductslotModule],
  controllers: [DetailsinvoiceController],
  providers: [DetailsinvoiceService],
  exports:[DetailsinvoiceService]
})
export class DetailsinvoiceModule {}
