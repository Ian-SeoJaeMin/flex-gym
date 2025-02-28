import { Module } from '@nestjs/common';
import { AttendService } from './attend.service';
import { AttendController } from './attend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attend } from '@src/attend/entities/attend.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Attend])],
    controllers: [AttendController],
    providers: [AttendService]
})
export class AttendModule {}
