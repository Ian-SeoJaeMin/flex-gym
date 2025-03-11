import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attend } from './entities/attend.entity';
import { Repository } from 'typeorm';
import { UserTokenDto } from '@src/token/dto/user-token.dto';
import { CreateAttendParamDto } from './dto/create-attend-param.dto';
import { Gym } from '@src/gym/entities/gym.entity';
import { Member } from '@src/member/entities/member.entity';
import { User } from '@src/user/entities/user.entity';

@Injectable()
export class AttendService {
    constructor(
        @InjectRepository(Attend) private attendRepository: Repository<Attend>,
        @InjectRepository(Member) private memberRepository: Repository<Member>,
        @InjectRepository(Gym) private gymRepository: Repository<Gym>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async createAttendance(userToken: UserTokenDto, attendParamDto: CreateAttendParamDto) {
        const { member, gym } = await this.findMemberAndGym(attendParamDto);
        const checkedBy = await this.findCheckedBy(userToken.userId);
        const attend = new Attend();
        attend.member = member;
        attend.gym = gym;
        attend.checkedBy = checkedBy;
        return this.attendRepository.save(attend);
    }

    async findCheckedBy(userId: string) {
        return this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        });
    }

    async findMemberAndGym(attendParamDto: CreateAttendParamDto) {
        const { gymId, memberId } = attendParamDto;
        const member = await this.memberRepository.findOneOrFail({ where: { id: memberId } }).catch(() => {
            throw new NotFoundException('존재하지 않는 회원입니다.');
        });
        const gym = await this.gymRepository.findOneOrFail({ where: { id: gymId } }).catch(() => {
            throw new NotFoundException('존재하지 않는 체육관입니다.');
        });
        return { member, gym };
    }
}
