import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDTO } from '@src/common/dto/api-response.dto';
import { User } from './entities/user.entity';
import { Public } from '@src/auth/decorator/public.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: '유저 목록 조회' })
    // @ApiResponse({ status: 200, description: '유저 목록 조회 성공', type: ApiResponseDTO })
    async findAll() {
        const users = await this.userService.findAll();
        return ApiResponseDTO.success(users);
    }

    @Get('/profile/:id')
    @ApiOperation({ summary: '유저 조회' })
    // @ApiResponse({ status: 200, description: '유저 조회 성공', type: User })
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOne(id);
        return ApiResponseDTO.success(user);
    }

    @Post('/signup')
    @Public()
    @ApiOperation({ summary: '회원가입' })
    // @ApiResponse({ status: 201, description: '회원가입 성공', type: User })
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        return ApiResponseDTO.success(user);
    }

    @Patch('/profile/:id')
    @ApiOperation({ summary: '유저 수정' })
    // @ApiResponse({ status: 200, description: '유저 수정 성공', type: User })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.userService.update(id, updateUserDto);
        return ApiResponseDTO.success(user);
    }

    @Delete(':id')
    @ApiOperation({ summary: '유저 삭제' })
    // @ApiResponse({ status: 200, description: '유저 삭제 성공', type: User })
    async remove(@Param('id') id: string) {
        const user = await this.userService.remove(id);
        return ApiResponseDTO.success(user);
    }
}
