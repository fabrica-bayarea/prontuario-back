import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: '*', // mudar em produção
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const config = new DocumentBuilder()
    .setTitle('Prontuário-back')
    .setDescription(
      'Documentação da API do Sistema de Prontuários do Núcleo Social IESB',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      supportedSubmitMethods: [],
    },
  });
  await app.listen(3000);
}
bootstrap();
