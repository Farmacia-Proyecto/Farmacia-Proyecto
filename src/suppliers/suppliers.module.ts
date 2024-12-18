import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supliers.entity';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';
import { LaboratorysuppliersModule } from 'src/laboratorysuppliers/laboratorysuppliers.module';

@Module({
  imports:[TypeOrmModule.forFeature([Supplier]),LaboratoryModule,LaboratorysuppliersModule],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports:[SuppliersService]
})
export class SuppliersModule {}
