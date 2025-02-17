import { TestBed } from '@automock/jest';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<Repository<User>>;
    let configService: jest.Mocked<ConfigService>;

    beforeEach(async () => {
        const { unit, unitRef } = TestBed.create(UserService).compile();
        userService = unit;
        userRepository = unitRef.get(getRepositoryToken(User) as string);
        configService = unitRef.get(ConfigService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('findAll', () => {
        it('should find all users', async () => {
            const result = [{ id: '1', email: 'test@test.com', password: 'password' }];
            jest.spyOn(userRepository, 'find').mockResolvedValue(result as User[]);
            const users = await userService.findAll();

            expect(users).toEqual(result);
            expect(userRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should find a user', async () => {
            const result = {
                id: '1',
                email: 'test@test.com',
                password: 'password'
            };
            jest.spyOn(userService, 'getUserById').mockResolvedValue(result as User);
            const user = await userService.findOne('1');

            expect(user).toEqual(result);
            expect(userService.getUserById).toHaveBeenCalledWith('1');
        });
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto = {
                email: 'test@test.com',
                password: 'password',
                name: 'test',
                phone: '01012345678'
            };
            const hashRound = 10;
            const hashedPassword = 'hashedPassword';
            const result = {
                id: '1',
                email: createUserDto.email,
                password: hashedPassword
            };

            jest.spyOn(userService, 'checkDuplicateEmail').mockResolvedValue();
            jest.spyOn(userService, 'checkDuplicatePhone').mockResolvedValue();
            jest.spyOn(configService, 'get').mockReturnValue(hashRound);
            jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword);
            userRepository.findOne.mockResolvedValue(result as User);

            const user = await userService.create(createUserDto);

            expect(user).toBeDefined();
            expect(userService.checkDuplicateEmail).toHaveBeenCalledWith(createUserDto.email);
            expect(userService.checkDuplicatePhone).toHaveBeenCalledWith(createUserDto.phone);
            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, hashRound);
            expect(userRepository.save).toHaveBeenCalledWith({
                ...createUserDto,
                password: hashedPassword
            });
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto = {
                name: 'test',
                phone: '01012345678'
            };
            const result = {
                id: '1',
                phone: updateUserDto.phone,
                name: updateUserDto.name
            };

            jest.spyOn(userService, 'getUserById').mockResolvedValue(result as User);
            jest.spyOn(userService, 'checkDuplicatePhone').mockResolvedValue();
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(result as User);

            const user = await userService.update('1', updateUserDto);

            expect(user).toEqual(result);
            expect(userService.getUserById).toHaveBeenCalledWith('1');
            expect(userService.checkDuplicatePhone).toHaveBeenCalledWith(updateUserDto.phone, '1');
            expect(userRepository.save).toHaveBeenCalledWith({
                ...result,
                ...updateUserDto
            });
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 1 } as DeleteResult);

            await userService.remove('1');
        });
    });

    describe('getUserById', () => {
        it('should get a user by id', async () => {
            jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue({ id: '1' } as User);

            const user = await userService.getUserById('1');

            expect(user).toEqual({ id: '1' });
            expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ id: '1' });
        });
        it('should throw an error if the user is not found', async () => {
            jest.spyOn(userRepository, 'findOneByOrFail').mockRejectedValue(new NotFoundException('존재하지 않는 유저입니다.'));

            await expect(userService.getUserById('1')).rejects.toThrow('존재하지 않는 유저입니다.');
        });
    });

    describe('checkDuplicateEmail', () => {
        it('should check duplicate email', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

            await userService.checkDuplicateEmail('test@test.com');

            expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@test.com' });
        });
        it('should throw an error if the email is already taken', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({ id: '1' } as User);

            await expect(userService.checkDuplicateEmail('test@test.com')).rejects.toThrow('이미 존재하는 이메일입니다.');
        });
    });

    describe('checkDuplicatePhone', () => {
        it('should check duplicate phone', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

            await userService.checkDuplicatePhone('01012345678');

            expect(userRepository.findOneBy).toHaveBeenCalledWith({ phone: '01012345678' });
        });
        it('should throw an error if the phone is already taken', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({ id: '1' } as User);

            await expect(userService.checkDuplicatePhone('01012345678')).rejects.toThrow('이미 존재하는 전화번호입니다.');
        });
    });
});
