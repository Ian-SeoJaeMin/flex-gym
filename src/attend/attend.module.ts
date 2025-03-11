import { Module } from '@nestjs/common';
import { AttendService } from './attend.service';
import { AttendController } from './attend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attend } from '@src/attend/entities/attend.entity';
import { Gym } from '@src/gym/entities/gym.entity';
import { User } from '@src/user/entities/user.entity';
import { Member } from '@src/member/entities/member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Attend, Gym, User, Member])],
    controllers: [AttendController],
    providers: [AttendService]
})
export class AttendModule {}
