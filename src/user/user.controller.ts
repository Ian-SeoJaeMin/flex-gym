import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: '유저 생성' })
    @ApiResponse({
        status: 201,
        description: '유저 생성 성공',
        type: User
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: '유저 목록 조회' })
    @ApiResponse({
        status: 200,
        description: '유저 목록 조회 성공',
        type: [User]
    })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '유저 조회' })
    @ApiResponse({
        status: 200,
        description: '유저 조회 성공',
        type: User
    })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: '유저 수정' })
    @ApiResponse({
        status: 200,
        description: '유저 수정 성공',
        type: User
    })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '유저 삭제' })
    @ApiResponse({
        status: 200,
        description: '유저 삭제 성공',
        type: User
    })
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
