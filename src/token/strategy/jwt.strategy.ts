import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { envVariableKeys } from '@src/common/code/consts/env.const';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            // Bearer $token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>(envVariableKeys.accessTokenSecret)
        });
    }

    validate(payload: any) {
        return payload;
    }
}
