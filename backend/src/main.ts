import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { promises as fs } from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Apply security headers with helmet
  app.use(helmet());

  // Enable CORS only for frontend origin
  const allowedOrigin = configService.get('cors.origin');
  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger setup
  if (configService.get('swagger.enabled') !== false) {
    const config = new DocumentBuilder()
      .setTitle(configService.get('swagger.title'))
      .setDescription(configService.get('swagger.description'))
      .setVersion(configService.get('swagger.version'))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Setup Swagger UI at /api/docs
    SwaggerModule.setup(configService.get('swagger.path'), app, document, {
      jsonDocumentUrl: 'docs-json',
    });

    // Export OpenAPI JSON to file for static access (async to avoid blocking)
    const outputPath = path.join(process.cwd(), 'openapi.json');
    fs.writeFile(outputPath, JSON.stringify(document, null, 2))
      .then(() => console.log(`OpenAPI spec exported to: ${outputPath}`))
      .catch((err) => console.error('Failed to export OpenAPI spec:', err));
  }

  const port = configService.get('port');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation: http://localhost:${port}/${configService.get('swagger.path')}`,
  );
  console.log(`OpenAPI JSON: http://localhost:${port}/${configService.get('swagger.path')}-json`);
}

bootstrap();
