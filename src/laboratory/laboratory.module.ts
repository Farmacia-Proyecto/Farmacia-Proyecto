import { Module } from '@nestjs/common';
import { LaboratoryController } from './laboratory.controller';
import { LaboratoryService } from './laboratory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from './laboratory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Laboratory])],
  providers: [LaboratoryService],
  controllers: [LaboratoryController],
  exports:[LaboratoryService]
})
export class LaboratoryModule {}
