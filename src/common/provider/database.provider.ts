import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envVariableKeys } from '../code/consts/env.const';

export const databaseProvider = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
            return {
                type: 'postgres',
                host: configService.get<string>(envVariableKeys.dbHost),
                port: configService.get<number>(envVariableKeys.dbPort),
                username: configService.get<string>(envVariableKeys.dbUsername),
                password: configService.get<string>(envVariableKeys.dbPassword),
                database: configService.get<string>(envVariableKeys.dbDatabase),
                entities: ['dist/**/*.entity{.ts,.js}'],
                synchronize: isDevelopment,
                logging: true
            } as TypeOrmModuleOptions;
        }
    })
];
