import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: '이메일' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: '비밀번호' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ description: '이름' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: '전화번호' })
    @IsString()
    @IsOptional()
    phone: string;
}
