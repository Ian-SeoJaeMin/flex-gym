import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { GetUser } from '@src/auth/decorator/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserTokenDto } from '@src/token/dto/user-token.dto';
import { Member } from './entities/member.entity';
import { ParamMemberDto } from './dto/param-member.dto';
@ApiTags('member')
@ApiBearerAuth()
@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @ApiOperation({ summary: '멤버 목록 조회', description: '모든 멤버 목록을 조회합니다.' })
    @ApiResponse({ status: 200, description: '멤버 목록을 성공적으로 조회했습니다.', type: [Member] })
    // TODO : 회원 검색 필터 옵션, 정렬, 페이징 기능 추가
    @Get(':gymId')
    findAll(@GetUser() user: UserTokenDto, @Query('gymId') gymId: string) {
        return this.memberService.findAll(user, gymId);
    }

    @Get(':gymId/:memberId')
    @ApiOperation({ summary: '멤버 상세 조회', description: '멤버 상세 정보를 조회합니다.' })
    @ApiResponse({ status: 200, description: '멤버 상세 정보를 성공적으로 조회했습니다.', type: Member })
    findOne(@GetUser() user: UserTokenDto, @Param() paramMemberDto: ParamMemberDto) {
        return this.memberService.findOne(user, paramMemberDto);
    }

    @Post(':gymId')
    @ApiOperation({ summary: '멤버 생성', description: '멤버를 생성합니다.' })
    @ApiResponse({ status: 201, description: '멤버를 성공적으로 생성했습니다.', type: Member })
    create(@GetUser() user: UserTokenDto, @Param('gymId') gymId: string, @Body() createMemberDto: CreateMemberDto) {
        return this.memberService.create(user, gymId, createMemberDto);
    }

    @Patch(':gymId/:memberId')
    @ApiOperation({ summary: '멤버 수정', description: '멤버 정보를 수정합니다.' })
    @ApiResponse({ status: 200, description: '멤버 정보를 성공적으로 수정했습니다.', type: Member })
    update(@GetUser() user: UserTokenDto, @Param() paramMemberDto: ParamMemberDto, @Body() updateMemberDto: UpdateMemberDto) {
        return this.memberService.update(user, paramMemberDto, updateMemberDto);
    }

    @Delete(':gymId/:memberId')
    remove(@GetUser() user: UserTokenDto, @Param() paramMemberDto: ParamMemberDto) {
        return this.memberService.remove(user, paramMemberDto);
    }
}
