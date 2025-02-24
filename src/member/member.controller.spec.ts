import { TestBed } from '@automock/jest';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { Member } from './entities/member.entity';
import { NotFoundException } from '@nestjs/common';
import { UserTokenDto } from '@src/token/dto/user-token.dto';
import { ParamMemberDto } from './dto/param-member.dto';
import { Gender } from '@src/common/code/enums/gender.enum';

describe('MemberController', () => {
    let memberController: MemberController;
    let memberService: jest.Mocked<MemberService>;

    beforeEach(async () => {
        const { unit, unitRef } = TestBed.create(MemberController).compile();
        memberController = unit;
        memberService = unitRef.get(MemberService);
    });

    it('should be defined', () => {
        expect(memberController).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all members', async () => {
            const gymId = '1';
            const user = { userId: '1' } as UserTokenDto;
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

            jest.spyOn(memberService, 'findAll').mockResolvedValue(result);

            const response = await memberController.findAll(user, gymId);

            expect(response).toEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return a member', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const paramMemberDto = { memberId: '1' } as ParamMemberDto;
            const result = {
                id: '1',
                name: '홍길동',
                phone: '010-1234-5678',
                birthdate: new Date('1990-01-01'),
                gender: Gender.MALE,
                joinedAt: new Date(),
                memo: '메모'
            } as Member;

            jest.spyOn(memberService, 'findOne').mockResolvedValue(result);

            const response = await memberController.findOne(user, paramMemberDto);

            expect(response).toEqual(result);
        });

        it('should throw an error if the member is not found', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const paramMemberDto = { memberId: '1' } as ParamMemberDto;

            jest.spyOn(memberService, 'findOne').mockRejectedValue(new NotFoundException('존재하지 않는 회원입니다.'));

            await expect(memberController.findOne(user, paramMemberDto)).rejects.toThrow('존재하지 않는 회원입니다.');
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

            jest.spyOn(memberService, 'create').mockResolvedValue(result);

            const response = await memberController.create(user, gymId, createMemberDto);

            expect(response).toEqual(result);
        });
    });

    describe('update', () => {
        it('should update a member', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const paramMemberDto = { memberId: '1' } as ParamMemberDto;
            const updateMemberDto = {
                name: '홍길동2',
                phone: '010-5678-1234'
            };
            const result = {
                id: '1',
                ...updateMemberDto,
                birthdate: new Date('1990-01-01'),
                gender: Gender.MALE,
                joinedAt: new Date(),
                memo: '메모'
            } as Member;

            jest.spyOn(memberService, 'update').mockResolvedValue(result);

            const response = await memberController.update(user, paramMemberDto, updateMemberDto);

            expect(response).toEqual(result);
        });

        it('should throw an error if the member is not found', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const paramMemberDto = { memberId: '1' } as ParamMemberDto;
            const updateMemberDto = { name: '홍길동2' };

            jest.spyOn(memberService, 'update').mockRejectedValue(new NotFoundException('존재하지 않는 회원입니다.'));

            await expect(memberController.update(user, paramMemberDto, updateMemberDto)).rejects.toThrow('존재하지 않는 회원입니다.');
        });
    });

    describe('remove', () => {
        it('should remove a member', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const paramMemberDto = { memberId: '1' } as ParamMemberDto;

            jest.spyOn(memberService, 'remove').mockResolvedValue(undefined);

            await memberController.remove(user, paramMemberDto);

            expect(memberService.remove).toHaveBeenCalledWith(user, paramMemberDto);
        });

        it('should throw an error if the member is not found', async () => {
            const user = { userId: '1' } as UserTokenDto;
            const paramMemberDto = { memberId: '1' } as ParamMemberDto;

            jest.spyOn(memberService, 'remove').mockRejectedValue(new NotFoundException('존재하지 않는 회원입니다.'));

            await expect(memberController.remove(user, paramMemberDto)).rejects.toThrow('존재하지 않는 회원입니다.');
        });
    });
});
