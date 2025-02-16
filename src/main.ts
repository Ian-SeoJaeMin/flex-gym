import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT');

    swaggerConfig(app);

    console.log(`Server is running on port ${port}`);
    await app.listen(port);
}
bootstrap();
