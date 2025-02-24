import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ParamMemberDto {
    @ApiProperty({ description: '체육관 ID' })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    gymId: string;

    @ApiProperty({ description: '멤버 ID' })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    memberId: string;
}
