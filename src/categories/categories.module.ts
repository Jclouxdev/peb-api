import { CategorieEntity } from './categorie.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieController } from './categories.controller';
import { CategorieService } from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategorieEntity])],
  controllers: [CategorieController],
  providers: [CategorieService],
  exports: [],
})
export class CategoriesModule {}
