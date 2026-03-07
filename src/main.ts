import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Apply global API prefix to all endpoints
  const apiPrefix = process.env.API_PREFIX;
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // ─── Enable CORS ─────────────────────────────────────────────────────────────
  app.enableCors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow any localhost port or any subdomain of fashionretailclub/foodretailclub
      if (
        origin.match(/^https?:\/\/localhost(:\d+)?$/) ||
        origin.match(/^https?:\/\/([a-zA-Z0-9-]+\.)?fashionretailclub\.com$/) ||
        origin.match(/^https?:\/\/([a-zA-Z0-9-]+\.)?foodretailclub\.com$/) ||
        // If you test from local network IP e.g. 192.168.x.x
        origin.match(/^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/)
      ) {
        return callback(null, true);
      }

      // Reject others to be secure
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // Allows cookies/authorization headers to be sent safely
  });

  // ─── Global Validation Pipe ──────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Delete any fields not defined in the DTO
      forbidNonWhitelisted: true, // Return error if there are unknown fields
      transform: true, // Convert data to the correct types automatically
    }),
  );

  // ─── Swagger Setup ───────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('FRC Backend API')
    .setDescription('Full API documentation for the FRC platform')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // it will keep the token after refresh
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
