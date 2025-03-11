import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Gym } from '@src/gym/entities/gym.entity';
import { User } from '@src/user/entities/user.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Member, Gym, User])],
    controllers: [MemberController],
    providers: [MemberService]
})
export class MemberModule {}
