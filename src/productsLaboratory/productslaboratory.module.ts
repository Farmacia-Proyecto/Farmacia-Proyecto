import { Module } from '@nestjs/common';
import { ProductslaboratoryService } from './productslaboratory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsLaboratory } from './productlaboratory.entity';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';

@Module({
    imports:[TypeOrmModule.forFeature([ProductsLaboratory]),LaboratoryModule],
    providers:[ProductslaboratoryService],
    exports:[ProductslaboratoryService]
})
export class ProductslaboratoryModule{}
