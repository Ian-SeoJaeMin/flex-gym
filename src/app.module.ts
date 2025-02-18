import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { databaseProvider } from './common/provider/database.provider';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { GymModule } from './gym/gym.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/jwt-auth.guard';
import { BearerTokenMiddleware } from './common/middleware/bearer-token.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
        }),
        CacheModule.register({
            ttl: 3000, // ttl 전역설정,
            isGlobal: true // 프로젝트 전체에서 사용
        }),
        JwtModule.register({}),
        ...databaseProvider,
        UserModule,
        AuthModule,
        GymModule
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(BearerTokenMiddleware)
            .exclude(
                {
                    path: 'auth/login',
                    method: RequestMethod.POST
                },
                {
                    path: 'user/signup',
                    method: RequestMethod.POST
                }
            )
            .forRoutes('*');
    }
}
