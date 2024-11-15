import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('main')
  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, })
  );

  const config = new DocumentBuilder()
  .setTitle('Teslo restful api')
  .setDescription('Teslo shop endpoints')
  .setVersion('1.0')
//  .addTag('cats')
  .build();
const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);


  await app.listen( process.env.PORT);

  logger.log(`app running on port ${process.env.PORT}`)
}
bootstrap();
