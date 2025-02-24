import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { Gender } from '@src/common/code/enums/gender.enum';
import { Transform } from 'class-transformer';
export class CreateMemberDto {
    @ApiProperty({ description: '이름' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: '전화번호' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ description: '생년월일' })
    @IsDateString()
    @IsOptional()
    birthdate: Date;

    @ApiProperty({ description: '성별' })
    @IsString()
    @IsOptional()
    gender: Gender;

    @ApiProperty({ description: '가입일' })
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDateString()
    @IsOptional()
    joinedAt: Date;

    @ApiProperty({ description: '메모' })
    @IsString()
    @IsOptional()
    memo: string;
}
