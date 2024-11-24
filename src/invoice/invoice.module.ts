import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { DetailsinvoiceModule } from 'src/detailsinvoice/detailsinvoice.module';
import { PersonModule } from 'src/person/person.module';

@Module({
    imports:[TypeOrmModule.forFeature([Invoice]),DetailsinvoiceModule,PersonModule],
    providers:[InvoiceService],
    controllers:[InvoiceController],
    exports:[InvoiceService]
})
export class InvoiceModule {}
