import { CategorieEntity } from './categorie.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CategorieEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CategoriesModule {}
