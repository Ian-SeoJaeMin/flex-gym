import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { UserTokenDto } from '@src/token/dto/user-token.dto';
import { Gym } from '@src/gym/entities/gym.entity';
import { ParamMemberDto } from './dto/param-member.dto';
import { User } from '@src/user/entities/user.entity';
import { Role } from '@src/common/code/enums/role.enum';
import { Not } from 'typeorm';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
        @InjectRepository(Gym)
        private readonly gymRepository: Repository<Gym>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    public async checkGymOwner(user: UserTokenDto, gymId: string) {
        const { userId, role } = user;
        const gym = await this.gymRepository.findOne({
            where: {
                id: gymId,
                ...(role !== Role.ADMIN && { owner: { id: userId } })
            },
            relations: ['owner'],
            join: {
                alias: 'gym',
                leftJoinAndSelect: {
                    owner: 'gym.owner'
                }
            }
        });

        if (!gym) {
            throw new NotFoundException('존재하지 않는 체육관이거나 접근 권한이 없습니다.');
        }

        return gym;
    }

    public async checkMember(gym: Gym, paramMemberDto: ParamMemberDto) {
        const { memberId } = paramMemberDto;
        const member = await this.memberRepository.findOne({
            where: { id: memberId, gym },
            select: ['id', 'name', 'phone']
        });
        if (!member) {
            throw new NotFoundException('존재하지 않는 회원입니다.');
        }
        return member;
    }

    public async memberPhoneCheck(phone: string, excludeMemberId?: string) {
        const where = {
            phone,
            ...(excludeMemberId && { id: Not(excludeMemberId) })
        };
        const member = await this.memberRepository.findOne({ where });
        if (member) {
            throw new BadRequestException('이미 존재하는 전화번호입니다.');
        }
    }

    async findAll(user: UserTokenDto, gymId: string) {
        const gym = await this.checkGymOwner(user, gymId);
        const members = await this.memberRepository.find({ where: { gym: { id: gymId } } });

        return members;
    }

    async findOne(user: UserTokenDto, paramMemberDto: ParamMemberDto) {
        const { gymId } = paramMemberDto;
        const gym = await this.checkGymOwner(user, gymId);
        const member = await this.checkMember(gym, paramMemberDto);

        return member;
    }
    async create(user: UserTokenDto, gymId: string, createMemberDto: CreateMemberDto) {
        const { phone } = createMemberDto;

        const gym = await this.checkGymOwner(user, gymId);
        await this.memberPhoneCheck(phone);

        return this.memberRepository.save({ ...createMemberDto, gym });
    }

    async update(user: UserTokenDto, paramMemberDto: ParamMemberDto, updateMemberDto: UpdateMemberDto) {
        const gym = await this.checkGymOwner(user, paramMemberDto.gymId);
        const member = await this.checkMember(gym, paramMemberDto);

        if (updateMemberDto.phone && updateMemberDto.phone !== member.phone) {
            await this.memberPhoneCheck(updateMemberDto.phone, member.id);
        }

        return this.memberRepository.save({ ...member, ...updateMemberDto });
    }

    async remove(user: UserTokenDto, paramMemberDto: ParamMemberDto) {
        const gym = await this.checkGymOwner(user, paramMemberDto.gymId);
        const member = await this.checkMember(gym, paramMemberDto);

        return this.memberRepository.softDelete(member.id);
    }
}
