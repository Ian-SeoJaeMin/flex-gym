import { TestBed } from '@automock/jest';
import { GymService } from './gym.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gym } from './entities/gym.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '@src/user/entities/user.entity';

describe('GymService', () => {
    let gymService: GymService;
    let gymRepository: jest.Mocked<Repository<Gym>>;

    beforeEach(async () => {
        const { unit, unitRef } = TestBed.create(GymService).compile();
        gymService = unit;
        gymRepository = unitRef.get(getRepositoryToken(Gym) as string);
    });

    it('should be defined', () => {
        expect(gymService).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all gyms', async () => {
            const result = [{ id: '1', name: '플렉스 짐' }] as Gym[];
            jest.spyOn(gymRepository, 'find').mockResolvedValue(result);

            const gyms = await gymService.findAll();

            expect(gyms).toEqual(result);
            expect(gymRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should find a gym', async () => {
            const result = { id: '1', name: '플렉스 짐' } as Gym;
            jest.spyOn(gymRepository, 'findOne').mockResolvedValue(result);

            const gym = await gymService.findOne('1');

            expect(gym).toEqual(result);
            expect(gymRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['owner']
            });
        });

        it('should throw an error if the gym is not found', async () => {
            jest.spyOn(gymRepository, 'findOne').mockResolvedValue(null);

            await expect(gymService.findOne('1')).rejects.toThrow('존재하지 않는 체육관입니다.');
        });
    });

    describe('create', () => {
        it('should create a gym', async () => {
            const owner = { id: '1', email: 'test@test.com' } as User;
            const createGymDto = {
                name: '플렉스 짐',
                postalCode: '06159',
                roadAddress: '서울특별시 강남구 테헤란로 427',
                jibunAddress: '서울특별시 강남구 삼성동 159',
                detailAddress: '위워크타워 10층',
                openTime: '09:00',
                closeTime: '22:00'
            };
            const result = { id: '1', ...createGymDto, owner } as Gym;

            jest.spyOn(gymRepository, 'create').mockReturnValue(result);
            jest.spyOn(gymRepository, 'save').mockResolvedValue(result);

            const gym = await gymService.create(owner, createGymDto);

            expect(gym).toEqual(result);
            expect(gymRepository.create).toHaveBeenCalledWith({
                ...createGymDto,
                owner
            });
            expect(gymRepository.save).toHaveBeenCalledWith(result);
        });
    });

    describe('update', () => {
        it('should update a gym', async () => {
            const existingGym = {
                id: '1',
                name: '플렉스 짐',
                openTime: '09:00',
                closeTime: '22:00'
            } as Gym;
            const updateGymDto = {
                name: '업데이트된 플렉스 짐',
                openTime: '08:00',
                closeTime: '23:00'
            };
            const updatedGym = { ...existingGym, ...updateGymDto };

            jest.spyOn(gymService, 'findOne').mockResolvedValue(existingGym);
            jest.spyOn(gymRepository, 'save').mockResolvedValue(updatedGym as Gym);

            const result = await gymService.update('1', updateGymDto);

            expect(result).toEqual(updatedGym);
            expect(gymRepository.save).toHaveBeenCalledWith(updatedGym);
        });

        it('should throw an error if the gym is not found', async () => {
            jest.spyOn(gymService, 'findOne').mockRejectedValue(new NotFoundException('존재하지 않는 체육관입니다.'));

            await expect(gymService.update('1', { name: '업데이트된 플렉스 짐' })).rejects.toThrow('존재하지 않는 체육관입니다.');
        });
    });

    describe('remove', () => {
        it('should remove a gym', async () => {
            const result = { affected: 1 };
            jest.spyOn(gymRepository, 'delete').mockResolvedValue(result as any);

            await gymService.remove('1');

            expect(gymRepository.delete).toHaveBeenCalledWith('1');
        });

        it('should throw an error if the gym is not found', async () => {
            const result = { affected: 0 };
            jest.spyOn(gymRepository, 'delete').mockResolvedValue(result as any);

            await expect(gymService.remove('1')).rejects.toThrow('존재하지 않는 체육관입니다.');
        });
    });
});
