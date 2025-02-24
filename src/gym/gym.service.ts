import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Gym } from './entities/gym.entity';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { User } from '@src/user/entities/user.entity';
import { Role } from '@src/common/code/enums/role.enum';
import { UserTokenDto } from '@src/token/dto/user-token.dto';

@Injectable()
export class GymService {
    constructor(
        @InjectRepository(Gym)
        private readonly gymRepository: Repository<Gym>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findAll(): Promise<Gym[]> {
        return this.gymRepository.find();
    }

    async findOne(id: string): Promise<Gym> {
        const gym = await this.gymRepository.findOne({
            where: { id },
            relations: ['owner']
        });
        if (!gym) {
            throw new NotFoundException('존재하지 않는 체육관입니다.');
        }
        return gym;
    }

    async create(user: UserTokenDto, createGymDto: CreateGymDto): Promise<Gym> {
        const owner = await this.getOwner(user);
        // 관리자가 생성하는 경우 owner를 넣지 않음
        // TODO : 관리자가 생성하는 경우에 owner를 어떻게 넣을지 고민해바야함
        const gym = this.gymRepository.create({ ...createGymDto, owner: owner.role === Role.USER ? owner : undefined });

        return this.gymRepository.save(gym);
    }

    async update(user: UserTokenDto, id: string, updateGymDto: UpdateGymDto): Promise<Gym> {
        const owner = await this.getOwner(user);
        const gym = await this.findOne(id);

        if (owner.role !== Role.ADMIN && gym.owner.id !== owner.id) {
            throw new ForbiddenException('체육관 수정 권한이 없습니다.');
        }

        const updated = Object.assign(gym, updateGymDto);
        return this.gymRepository.save(updated);
    }

    async remove(id: string): Promise<void> {
        const result = await this.gymRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('존재하지 않는 체육관입니다.');
        }
    }

    private async getOwner(user: UserTokenDto): Promise<User> {
        const owner = await this.userRepository.findOne({
            where: { id: user.userId }
        });
        if (!owner) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }
        return owner;
    }
}
