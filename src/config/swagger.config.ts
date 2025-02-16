import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfig(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('FlexGym API Documentation')
        .setDescription('FlexGym API Documentation')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);
}
