import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptors/data-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //enable cors
  app.enableCors();

  //Add Global Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, //this option enable implicite type conversion. so we dont need to add Type decorator in dtos for type conversion. see example in paginationQuery.dto
      },
    }),
  );
  //Add Global Interceptor
  // app.useGlobalInterceptors(new DataResponseInterceptor());

  //Swagger Documentation
  const config = new DocumentBuilder()
    //Swagger Configuration:
    .setVersion('1.0')
    .setTitle('Blog App Server')
    .setDescription('Use the base url as : http://localhost:5000')
    .setTermsOfService('http://localhost:5000/terms-of-service')
    .addServer('http://localhost:5000')
    .build();

  //Instantiate Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
