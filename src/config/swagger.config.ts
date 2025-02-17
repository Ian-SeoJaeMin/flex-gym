import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfig(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('FlexGym API Documentation')
        .setDescription('FlexGym API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addBasicAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true // 인증정보 유지
        }
    });
}
