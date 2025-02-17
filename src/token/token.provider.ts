import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '@src/common/code/enums/token-type.enum';
import { UserTokenDto } from './dto/user-token.dto';
import { envVariableKeys } from '@src/common/code/consts/env.const';

@Injectable()
export class TokenProvider {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    issueToken(tokenType: TokenType, tokenInfo: UserTokenDto, expiresIn: number) {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        tokenInfo = {
            ...tokenInfo,
            tokenType,
            exp: currentTimeInSeconds + expiresIn
        };
        return this.jwtService.signAsync(
            {
                ...tokenInfo
            },
            {
                secret: this.configService.get<string>(
                    tokenType === TokenType.ACCESS_TOKEN ? envVariableKeys.accessTokenSecret : envVariableKeys.refreshTokenSecret
                )
                // expiresIn
            }
        );
    }
}
