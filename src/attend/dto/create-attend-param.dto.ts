import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAttendParamDto {
    @IsString()
    @IsNotEmpty()
    gymId: string;

    @IsString()
    @IsNotEmpty()
    memberId: string;
}
