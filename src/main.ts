import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './core/redis/redis.service';
import { RedisStore } from 'connect-redis';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { ms, StringValue } from './shared/utils/ms.util';
import { parseBoolean } from './shared/utils/parse-boolean.util';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const redis = app.get(RedisService);
  const redisStore = new RedisStore({
    client: redis,
    prefix: config.getOrThrow<string>('SESSION_FOLDER'),
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: redisStore,
    }),
  );
  app.enableCors({
    //origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  const swaggerConfig = new DocumentBuilder().setTitle('ApiDocs').build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
