import { forwardRef, Module } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';
import { PurchaseorderController } from './purchaseorder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchaseorder.entity';
import { ProductModule } from 'src/product/product.module';
import { PersonModule } from 'src/person/person.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { OrderdetailsModule } from 'src/orderdetails/orderdetails.module';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';
import { LaboratorysuppliersModule } from 'src/laboratorysuppliers/laboratorysuppliers.module';
import { ProductslotModule } from 'src/productsLot/productslot.module';
import { LotService } from 'src/lot/lot.service';

@Module({
  imports:[TypeOrmModule.forFeature([PurchaseOrder]),PersonModule,
  forwardRef(()=>ProductModule),SuppliersModule,OrderdetailsModule,LaboratoryModule,
  LaboratorysuppliersModule,ProductslotModule],
  controllers: [PurchaseorderController],
  providers: [PurchaseorderService],
  exports:[PurchaseorderService]
})
export class PurchaseorderModule {}
