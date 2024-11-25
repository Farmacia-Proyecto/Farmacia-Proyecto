import { Module } from '@nestjs/common';
import { LaboratorysuppliersService } from './laboratorysuppliers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaboratorySuppliers } from './laboratorysuppliers.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LaboratorySuppliers])],
  providers: [LaboratorysuppliersService],
  exports: [LaboratorysuppliersService]
})
export class LaboratorysuppliersModule {}
