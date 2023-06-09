import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { CategorieEntity } from './categories/categorie.entity';
import { MarkerEntity } from './markers/marker.entity';
import { CategoriesModule } from './categories/categories.module';
import { MarkersModule } from './markers/markers.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/avatars/'),
      serveStaticOptions: {
        index: false,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [UserEntity, CategorieEntity, MarkerEntity],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CategoriesModule,
    MarkersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
