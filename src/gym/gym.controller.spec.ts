import { TestBed } from '@automock/jest';
import { GymController } from './gym.controller';
import { GymService } from './gym.service';
import { Gym } from './entities/gym.entity';
import { NotFoundException } from '@nestjs/common';
import { User } from '@src/user/entities/user.entity';
import { UserTokenDto } from '@src/token/dto/user-token.dto';

describe('GymController', () => {
    let gymController: GymController;
    let gymService: jest.Mocked<GymService>;

    beforeEach(async () => {
        const { unit, unitRef } = TestBed.create(GymController).compile();
        gymController = unit;
        gymService = unitRef.get(GymService);
    });

    it('should be defined', () => {
        expect(gymController).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all gyms', async () => {
            const result = [{ id: '1', name: '플렉스 짐' }] as Gym[];
            jest.spyOn(gymService, 'findAll').mockResolvedValue(result);

            const response = await gymController.findAll();

            expect(response).toEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return a gym', async () => {
            const result = { id: '1', name: '플렉스 짐' } as Gym;
            jest.spyOn(gymService, 'findOne').mockResolvedValue(result);

            const response = await gymController.findOne('1');

            expect(response).toEqual(result);
        });

        it('should throw an error if the gym is not found', async () => {
            jest.spyOn(gymService, 'findOne').mockRejectedValue(new NotFoundException('존재하지 않는 체육관입니다.'));

            await expect(gymController.findOne('1')).rejects.toThrow('존재하지 않는 체육관입니다.');
        });
    });

    describe('create', () => {
        it('should create a gym', async () => {
            const owner = { userId: '1' } as UserTokenDto;
            const createGymDto = {
                name: '플렉스 짐',
                postalCode: '06159',
                roadAddress: '서울특별시 강남구 테헤란로 427',
                jibunAddress: '서울특별시 강남구 삼성동 159',
                detailAddress: '위워크타워 10층',
                openTime: '09:00',
                closeTime: '22:00'
            };
            const result = { id: '1', ...createGymDto } as Gym;

            jest.spyOn(gymService, 'create').mockResolvedValue(result);

            const response = await gymController.create(owner, createGymDto);

            expect(response).toEqual(result);
        });
    });

    describe('update', () => {
        it('should update a gym', async () => {
            const owner = { userId: '1' } as UserTokenDto;
            const updateGymDto = {
                name: '업데이트된 플렉스 짐',
                openTime: '08:00',
                closeTime: '23:00'
            };
            const result = { id: '1', ...updateGymDto } as Gym;

            jest.spyOn(gymService, 'update').mockResolvedValue(result);

            const response = await gymController.update(owner, '1', updateGymDto);

            expect(response).toEqual(result);
        });

        it('should throw an error if the gym is not found', async () => {
            const owner = { userId: '1' } as UserTokenDto;
            const updateGymDto = {
                name: '업데이트된 플렉스 짐',
                openTime: '08:00',
                closeTime: '23:00'
            };
            jest.spyOn(gymService, 'update').mockRejectedValue(new NotFoundException('존재하지 않는 체육관입니다.'));

            await expect(gymController.update(owner, '1', updateGymDto)).rejects.toThrow('존재하지 않는 체육관입니다.');
        });
    });

    describe('remove', () => {
        it('should remove a gym', async () => {
            jest.spyOn(gymService, 'remove').mockResolvedValue(undefined);

            await gymController.remove('1');

            expect(gymService.remove).toHaveBeenCalledWith('1');
        });

        it('should throw an error if the gym is not found', async () => {
            jest.spyOn(gymService, 'remove').mockRejectedValue(new NotFoundException('존재하지 않는 체육관입니다.'));

            await expect(gymController.remove('1')).rejects.toThrow('존재하지 않는 체육관입니다.');
        });
    });
});
