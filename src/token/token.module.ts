import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { TokenProvider } from './token.provider';
import { UserTokenGeneratorService } from './generator/user-token.generator';

@Module({
    imports: [JwtModule.register({})],
    controllers: [],
    providers: [
        TokenService,
        TokenProvider,
        UserTokenGeneratorService,
        {
            provide: 'TOKEN_GENERATORS',
            useFactory: (userTokenGenerator: UserTokenGeneratorService) => {
                return [userTokenGenerator];
            },
            inject: [UserTokenGeneratorService]
        }
    ],
    exports: [TokenService]
})
export class TokenModule {}
