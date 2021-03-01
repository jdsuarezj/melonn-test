import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const options = new DocumentBuilder()
    .setTitle('Melonn Backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const defaultPort = process.env.NEST_PORT ? process.env.NEST_PORT : 3001;

  await app.listen(defaultPort, () => {
    console.log(`Se ha iniciado melonn-back en el puerto ${defaultPort}`);
  });
}
bootstrap();
