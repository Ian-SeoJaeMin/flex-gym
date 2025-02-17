import { ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Authorization } from './decorator/authorization.decorator';
import { Public } from './decorator/public.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: '로그인' })
    @ApiBasicAuth()
    @Public()
    @Post('login')
    login(@Authorization() loginDto: LoginDto) {
        // TODO : 로그인 처리
        return 'login';
        // return this.authService.login(loginDto);
    }
}
