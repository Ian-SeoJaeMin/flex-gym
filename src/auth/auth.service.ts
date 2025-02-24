import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { envVariableKeys } from '@src/common/code/consts/env.const';
import * as bcrypt from 'bcrypt';
import { TokenService } from '@src/token/token.service';
import { UserTokenDto } from '@src/token/dto/user-token.dto';
import { TokenResponseDto } from '@src/token/dto/token-response.dto';
import { Role } from '@src/common/code/enums/role.enum';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userTokenService: TokenService<UserTokenDto, Promise<TokenResponseDto>>
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        return this.generateToken(user);
    }

    private async validateUser({ email, password }: LoginDto) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new BadRequestException('존재하지 않는 이메일입니다.');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('비밀번호가 일치하지 않습니다.');

        return user;
    }

    private generateToken(user: User) {
        const { role, id } = user;
        switch (role) {
            case Role.USER:
                const userTokenDto = new UserTokenDto();
                userTokenDto.userId = id;
                userTokenDto.role = role;
                return this.userTokenService.issueToken(userTokenDto, role);
            // case UserType.ADMIN:
            // return this.adminTokenService.issueToken(user);
        }
    }
}
