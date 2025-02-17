import { TestBed } from '@automock/jest';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
describe('UserController', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;

    beforeEach(async () => {
        const { unit, unitRef } = TestBed.create(UserController).compile();
        userController = unit;
        userService = unitRef.get(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const result = [{ id: '1', email: 'test@test.com', password: 'password' }] as User[];
            jest.spyOn(userService, 'findAll').mockResolvedValue(result);

            const response = await userController.findAll();

            expect(response).toEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return a user', async () => {
            const result = { id: '1', email: 'test@test.com', password: 'password' } as User;
            jest.spyOn(userService, 'findOne').mockResolvedValue(result);

            const response = await userController.findOne('1');

            expect(response).toEqual(result);
        });
        it('should throw an error if the user is not found', async () => {
            jest.spyOn(userService, 'findOne').mockRejectedValue(new NotFoundException('User not found'));

            await expect(userController.findOne('1')).rejects.toThrow('User not found');
        });
    });

    describe('signup', () => {
        it('should create a user', async () => {
            const createUserDto = { email: 'test@test.com', password: 'password', name: 'test', phone: '01012345678' };
            const result = { id: '1', email: createUserDto.email, password: createUserDto.password };

            jest.spyOn(userService, 'create').mockResolvedValue(result as User);

            const response = await userController.create(createUserDto);

            expect(response).toEqual(result);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto = { name: 'test', phone: '01012345678' };
            const result = { id: '1', ...updateUserDto };

            jest.spyOn(userService, 'update').mockResolvedValue(result as User);

            const response = await userController.update('1', updateUserDto);

            expect(response).toEqual(result);
        });
        it('should throw an error if the user is not found', async () => {
            jest.spyOn(userService, 'update').mockRejectedValue(new NotFoundException('User not found'));

            await expect(userController.update('1', { name: 'test', phone: '01012345678' })).rejects.toThrow('User not found');
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            jest.spyOn(userService, 'remove').mockResolvedValue({ affected: 1 } as DeleteResult);

            await userController.remove('1');
        });
    });
});
