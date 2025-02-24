import { TestBed } from '@automock/jest';
import { MemberService } from './member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '@src/user/entities/user.entity';
import { Gender } from '@src/common/code/enums/gender.enum';
import { UserTokenDto } from '@src/token/dto/user-token.dto';
import { Gym } from '@src/gym/entities/gym.entity';

describe('MemberService', () => {
    let memberService: MemberService;
    let memberRepository: jest.Mocked<Repository<Member>>;

    beforeEach(async () => {
        const { unit, unitRef } = TestBed.create(MemberService).compile();
        memberService = unit;
        memberRepository = unitRef.get(getRepositoryToken(Member) as string);
    });

    it('should be defined', () => {
        expect(memberService).toBeDefined();
    });

    describe('checkGymOwner', () => {
        it('should return the gym if the user is the owner', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const result = { id: gymId } as Gym;

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue(result);

            const gym = await memberService.checkGymOwner(user, gymId);

            expect(gym).toEqual(result);
        });

        it('should throw an error if the gym is not found', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';

            jest.spyOn(memberService, 'checkGymOwner').mockRejectedValue(new NotFoundException('존재하지 않는 체육관입니다.'));

            await expect(memberService.checkGymOwner(user, gymId)).rejects.toThrow('존재하지 않는 체육관입니다.');
        });
    });

    describe('checkMember', () => {
        it('should return the member if it exists', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const memberId = '1';
            const result = { id: memberId } as Member;

            jest.spyOn(memberService, 'checkMember').mockResolvedValue(result);

            const member = await memberService.checkMember({ id: gymId } as Gym, { memberId, gymId });

            expect(member).toEqual(result);
        });

        it('should throw an error if the member is not found', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const memberId = '1';

            jest.spyOn(memberService, 'checkMember').mockRejectedValue(new NotFoundException('존재하지 않는 회원입니다.'));

            await expect(memberService.checkMember({ id: gymId } as Gym, { memberId, gymId })).rejects.toThrow('존재하지 않는 회원입니다.');
        });
    });

    describe('findAll', () => {
        it('should return all members', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const result = [
                {
                    id: '1',
                    name: '홍길동',
                    phone: '010-1234-5678',
                    birthdate: new Date('1990-01-01'),
                    gender: Gender.MALE,
                    joinedAt: new Date(),
                    memo: '메모'
                }
            ] as Member[];

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue({ id: gymId } as Gym);
            jest.spyOn(memberRepository, 'find').mockResolvedValue(result);

            const members = await memberService.findAll(user, gymId);

            expect(members).toEqual(result);
            expect(memberRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should find a member', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const memberId = '1';
            const result = {
                id: '1',
                name: '홍길동',
                phone: '010-1234-5678',
                birthdate: new Date('1990-01-01'),
                gender: Gender.MALE,
                joinedAt: new Date(),
                memo: '메모'
            } as Member;

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue({ id: gymId } as Gym);
            jest.spyOn(memberService, 'checkMember').mockResolvedValue(result);

            const member = await memberService.findOne(user, { memberId, gymId });

            expect(member).toEqual(result);
            expect(memberService.checkGymOwner).toHaveBeenCalledWith(user, gymId);
            expect(memberService.checkMember).toHaveBeenCalledWith({ id: gymId } as Gym, { memberId, gymId });
        });

        it('should throw an error if the member is not found', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const memberId = '1';

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue({ id: gymId } as Gym);
            jest.spyOn(memberService, 'checkMember').mockRejectedValue(new NotFoundException('존재하지 않는 회원입니다.'));

            await expect(memberService.findOne(user, { memberId, gymId })).rejects.toThrow('존재하지 않는 회원입니다.');
        });
    });

    describe('create', () => {
        it('should create a member', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const createMemberDto = {
                name: '홍길동',
                phone: '010-1234-5678',
                birthdate: new Date('1990-01-01'),
                gender: Gender.MALE,
                memo: '메모',
                joinedAt: new Date()
            };
            const result = {
                id: '1',
                ...createMemberDto,
                joinedAt: expect.any(Date)
            } as Member;

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue({ id: gymId } as Gym);
            jest.spyOn(memberService, 'memberPhoneCheck').mockResolvedValue();
            jest.spyOn(memberRepository, 'save').mockResolvedValue(result);

            const member = await memberService.create(user, gymId, createMemberDto);

            expect(member).toEqual(result);
            expect(memberService.checkGymOwner).toHaveBeenCalledWith(user, gymId);
            expect(memberService.memberPhoneCheck).toHaveBeenCalledWith(createMemberDto.phone);
            expect(memberRepository.save).toHaveBeenCalledWith({ ...createMemberDto, gym: { id: gymId } });
        });
    });

    describe('update', () => {
        it('should update a member', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const memberId = '1';
            const existingMember = {
                id: '1',
                name: '홍길동',
                phone: '010-1234-5678',
                birthdate: new Date('1990-01-01'),
                gender: Gender.MALE,
                joinedAt: new Date(),
                memo: '메모'
            } as Member;

            const updateMemberDto = {
                name: '홍길동2',
                phone: '010-5678-1234'
            };

            const updatedMember = { ...existingMember, ...updateMemberDto };

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue({ id: gymId } as Gym);
            jest.spyOn(memberService, 'checkMember').mockResolvedValue(existingMember);
            jest.spyOn(memberService, 'memberPhoneCheck').mockResolvedValue();
            jest.spyOn(memberRepository, 'save').mockResolvedValue(updatedMember as Member);

            const result = await memberService.update(user, { memberId, gymId }, updateMemberDto);

            expect(result).toEqual(updatedMember);
            expect(memberService.checkGymOwner).toHaveBeenCalledWith(user, gymId);
            expect(memberService.checkMember).toHaveBeenCalledWith({ id: gymId } as Gym, { memberId, gymId });
            expect(memberService.memberPhoneCheck).toHaveBeenCalledWith(updateMemberDto.phone, existingMember.id);
            expect(memberRepository.save).toHaveBeenCalledWith(updatedMember);
        });

        it('should throw an error if the member is not found', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const memberId = '1';
            const updateMemberDto = { name: '홍길동2' };

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue({ id: gymId } as Gym);
            jest.spyOn(memberService, 'checkMember').mockRejectedValue(new NotFoundException('존재하지 않는 회원입니다.'));

            await expect(memberService.update(user, { memberId, gymId }, updateMemberDto)).rejects.toThrow('존재하지 않는 회원입니다.');
        });
    });

    describe('remove', () => {
        it('should remove a member', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const memberId = '1';
            const result = { affected: 1 };

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue({ id: gymId } as Gym);
            jest.spyOn(memberService, 'checkMember').mockResolvedValue({ id: memberId } as Member);
            jest.spyOn(memberRepository, 'softDelete').mockResolvedValue(result as any);

            await memberService.remove(user, { memberId, gymId });

            expect(memberService.checkGymOwner).toHaveBeenCalledWith(user, gymId);
            expect(memberService.checkMember).toHaveBeenCalledWith({ id: gymId } as Gym, { memberId, gymId });
            expect(memberRepository.softDelete).toHaveBeenCalledWith(memberId);
        });

        it('should throw an error if the member is not found', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const gymId = '1';
            const memberId = '1';
            const result = { affected: 0 };

            jest.spyOn(memberService, 'checkGymOwner').mockResolvedValue({ id: gymId } as Gym);
            jest.spyOn(memberService, 'checkMember').mockRejectedValue(new NotFoundException('존재하지 않는 회원입니다.'));

            await expect(memberService.remove(user, { memberId, gymId })).rejects.toThrow('존재하지 않는 회원입니다.');
        });
    });
});
