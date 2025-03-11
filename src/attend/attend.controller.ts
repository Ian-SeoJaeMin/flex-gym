import { Controller, Param, Post } from '@nestjs/common';
import { AttendService } from './attend.service';
import { GetUser } from '@src/auth/decorator/get-user.decorator';
import { UserTokenDto } from '@src/token/dto/user-token.dto';
import { CreateAttendParamDto } from './dto/create-attend-param.dto';
@Controller('attend')
export class AttendController {
    constructor(private readonly attendService: AttendService) {}

    @Post('/:gymId/:memberId')
    async createAttendance(@GetUser() userToken: UserTokenDto, @Param() attendParamDto: CreateAttendParamDto) {
        return this.attendService.createAttendance(userToken, attendParamDto);
    }
}
