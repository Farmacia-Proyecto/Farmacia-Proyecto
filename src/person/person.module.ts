import { Module } from "@nestjs/common"
import { PersonService } from './person.service';
import { PersonController } from "./person.controller";
import {TypeOrmModule} from "@nestjs/typeorm"
import { Person } from "./person.entity";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Person]),UserModule],
    controllers: [PersonController],
    providers: [PersonService],
    exports:[PersonService]
})
export class PersonModule{}