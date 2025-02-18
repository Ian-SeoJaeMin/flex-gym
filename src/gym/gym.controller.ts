import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { GetUser } from '@src/auth/decorator/get-user.decorator';
import { User } from '@src/user/entities/user.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Gym } from './entities/gym.entity';

@ApiTags('gym')
@Controller('gym')
@ApiBearerAuth()
export class GymController {
    constructor(private readonly gymService: GymService) {}

    @Post()
    @ApiOperation({
        summary: '체육관 생성',
        description: '새로운 체육관을 생성합니다.'
    })
    @ApiResponse({
        status: 201,
        description: '체육관이 성공적으로 생성되었습니다.',
        type: Gym
    })
    create(@GetUser() user: User, @Body() createGymDto: CreateGymDto) {
        return this.gymService.create(user, createGymDto);
    }

    @Get()
    @ApiOperation({
        summary: '체육관 목록 조회',
        description: '모든 체육관 목록을 조회합니다.'
    })
    @ApiResponse({
        status: 200,
        description: '체육관 목록을 성공적으로 조회했습니다.',
        type: [Gym]
    })
    findAll() {
        return this.gymService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: '체육관 상세 조회',
        description: '특정 체육관의 상세 정보를 조회합니다.'
    })
    @ApiResponse({
        status: 200,
        description: '체육관 정보를 성공적으로 조회했습니다.',
        type: Gym
    })
    @ApiParam({
        name: 'id',
        description: '체육관 ID'
    })
    findOne(@Param('id') id: string) {
        return this.gymService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: '체육관 정보 수정',
        description: '특정 체육관의 정보를 수정합니다.'
    })
    @ApiResponse({
        status: 200,
        description: '체육관 정보가 성공적으로 수정되었습니다.',
        type: Gym
    })
    @ApiParam({
        name: 'id',
        description: '체육관 ID'
    })
    update(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
        return this.gymService.update(id, updateGymDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: '체육관 삭제',
        description: '특정 체육관을 삭제합니다.'
    })
    @ApiResponse({
        status: 200,
        description: '체육관이 성공적으로 삭제되었습니다.'
    })
    @ApiParam({
        name: 'id',
        description: '체육관 ID'
    })
    remove(@Param('id') id: string) {
        return this.gymService.remove(id);
    }
}
