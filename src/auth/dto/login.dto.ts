import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: '이메일' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: '비밀번호' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
