import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkerEntity } from './marker.entity';
import { MarkersController } from './markers.controller';
import { MarkersService } from './markers.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../users/users.module';
import { UserEntity } from 'src/users/user.entity';
import { CategorieEntity } from 'src/categories/categorie.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarkerEntity, UserEntity, CategorieEntity]),
    forwardRef(() => AuthModule),
    UserModule,
    CategoriesModule,
  ],
  controllers: [MarkersController],
  providers: [MarkersService],
  exports: [MarkersService],
})
export class MarkersModule {}
