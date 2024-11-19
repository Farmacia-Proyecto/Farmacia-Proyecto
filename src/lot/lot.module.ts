import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Lot])],
    providers: [LotService],
    controllers: [LotController]
  })
export class LotModule {}
