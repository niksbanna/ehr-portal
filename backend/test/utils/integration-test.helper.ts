import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

export class IntegrationTestHelper {
  static async createTestApp(moduleMetadata: any): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule(moduleMetadata).compile();

    const app = moduleFixture.createNestApplication();

    // Apply same global pipes as main app
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    return app;
  }

  static async closeApp(app: INestApplication): Promise<void> {
    await app.close();
  }

  static getRequest(app: INestApplication) {
    return request(app.getHttpServer());
  }
}

export { request };
