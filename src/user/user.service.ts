import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { envVariableKeys } from '@src/common/code/consts/env.const';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ConflictUserException } from '@src/common/exception/conflict-user.exception';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly configService: ConfigService
    ) {}

    findAll() {
        return this.userRepository.find();
    }

    async findOne(id: string) {
        return this.getUserById(id);
    }

    async create(createUserDto: CreateUserDto) {
        const { password, email, phone } = createUserDto;

        await this.checkDuplicateEmail(email);
        await this.checkDuplicatePhone(phone);

        const hashedPassword = await bcrypt.hash(password, parseInt(this.configService.get(envVariableKeys.bcryptSaltRounds)));

        await this.userRepository.save({
            ...createUserDto,
            password: hashedPassword
        });

        return this.userRepository.findOne({ where: { email } });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const { phone } = updateUserDto;

        const user = await this.getUserById(id);

        await this.checkDuplicatePhone(phone, id);

        await this.userRepository.save({ ...user, ...updateUserDto });

        return this.userRepository.findOne({ where: { id } });
    }

    remove(id: string) {
        return this.userRepository.delete(id);
    }

    async getUserById(id: string) {
        return this.userRepository.findOneByOrFail({ id }).catch(e => {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        });
    }

    async checkDuplicateEmail(email: string, excludeId?: string) {
        const existingUser = await this.userRepository.findOneBy({ email, id: excludeId ? Not(excludeId) : undefined });
        if (existingUser) {
            throw new ConflictUserException(null, email);
        }
    }

    async checkDuplicatePhone(phone: string, excludeId?: string) {
        const existingUser = await this.userRepository.findOneBy({ phone, id: excludeId ? Not(excludeId) : undefined });
        if (existingUser) {
            throw new ConflictUserException(phone, null);
        }
    }
}
