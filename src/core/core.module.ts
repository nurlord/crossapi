import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/auth/users/users.module';
import { RedisModule } from './redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../shared/guards/auth.guard';
import { FilesModule } from './files/files.module';
import { BooksModule } from '../modules/books/books.module';
import { StreamModule } from './stream/stream.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { AuthorsModule } from '../modules/authors/authors.module';
import { ProfileModule } from '../modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    FilesModule,
    UsersModule,
    AuthModule,
    BooksModule,
    StreamModule,
    CategoriesModule,
    AuthorsModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CoreModule {}
