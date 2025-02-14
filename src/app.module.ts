import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { databaseProvider } from './common/provider/database.provider';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
        }),
        ...databaseProvider
    ],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
