import { Injectable } from '@nestjs/common';
import { TokenType } from '@src/common/code/enums/token-type.enum';
import { TokenResponseDto } from '../dto/token-response.dto';
import { TokenGenerator } from '../interface/token-generator.interface';
import { TokenProvider } from '../token.provider';
import { UserTokenDto } from '../dto/user-token.dto';
import { jwtConfig } from '@src/config/jwt.config';
import { Role } from '@src/common/code/enums/role.enum';

@Injectable()
export class UserTokenGeneratorService implements TokenGenerator<UserTokenDto, Promise<TokenResponseDto>> {
    constructor(private readonly tokenProvidor: TokenProvider) {}

    async issueToken(userTokenDto: UserTokenDto): Promise<TokenResponseDto> {
        console.log(userTokenDto);
        return {
            accessToken: await this.tokenProvidor.issueToken(TokenType.ACCESS_TOKEN, userTokenDto, jwtConfig.user.accessTokenExpiresIn),
            refreshToken: await this.tokenProvidor.issueToken(TokenType.REFRESH_TOKEN, userTokenDto, jwtConfig.user.refreshTokenExpireIn)
        };
    }

    getUserRoleName(): Role {
        return Role.USER;
    }
}
