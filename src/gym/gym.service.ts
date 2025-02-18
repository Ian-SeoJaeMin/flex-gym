import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gym } from './entities/gym.entity';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { User } from '@src/user/entities/user.entity';

@Injectable()
export class GymService {
    constructor(
        @InjectRepository(Gym)
        private readonly gymRepository: Repository<Gym>
    ) {}

    async create(owner: User, createGymDto: CreateGymDto): Promise<Gym> {
        const gym = this.gymRepository.create({
            ...createGymDto,
            owner
        });
        return this.gymRepository.save(gym);
    }

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

    async update(id: string, updateGymDto: UpdateGymDto): Promise<Gym> {
        const gym = await this.findOne(id);
        const updated = Object.assign(gym, updateGymDto);
        return this.gymRepository.save(updated);
    }

    async remove(id: string): Promise<void> {
        const result = await this.gymRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('존재하지 않는 체육관입니다.');
        }
    }
}
