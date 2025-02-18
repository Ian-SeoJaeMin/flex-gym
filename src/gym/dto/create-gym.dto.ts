import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateGymDto {
    @ApiProperty({
        description: '체육관 이름',
        example: '플렉스 짐'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: '체육관 전화번호',
        example: '02-1234-5678',
        required: false
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        description: '체육관 웹사이트',
        example: 'https://flexgym.com',
        required: false
    })
    @IsString()
    @IsOptional()
    website?: string;

    @ApiProperty({
        description: '우편번호',
        example: '06159'
    })
    @IsString()
    @IsNotEmpty()
    postalCode: string;

    @ApiProperty({
        description: '도로명 주소',
        example: '서울특별시 강남구 테헤란로 427'
    })
    @IsString()
    @IsNotEmpty()
    roadAddress: string;

    @ApiProperty({
        description: '지번 주소',
        example: '서울특별시 강남구 삼성동 159'
    })
    @IsString()
    @IsNotEmpty()
    jibunAddress: string;

    @ApiProperty({
        description: '상세 주소',
        example: '위워크타워 10층',
        required: false
    })
    @IsString()
    @IsOptional()
    detailAddress?: string;

    @ApiProperty({
        description: '운영 시작 시간 (24시간 형식)',
        example: '09:00'
    })
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: '올바른 시간 형식이 아닙니다. (HH:mm)'
    })
    openTime: string;

    @ApiProperty({
        description: '운영 종료 시간 (24시간 형식)',
        example: '22:00'
    })
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: '올바른 시간 형식이 아닙니다. (HH:mm)'
    })
    closeTime: string;

    @ApiProperty({
        description: '체육관 설명',
        example: '24시간 운영되는 프리미엄 피트니스 센터입니다.',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;
}
