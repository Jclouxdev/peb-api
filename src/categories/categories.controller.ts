import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategorieService } from './categories.service';
import { CategorieEntity } from './categorie.entity';

@Controller('categories')
export class CategorieController {
  constructor(private readonly categorieRepo: CategorieService) {}

  @Get('/')
  getAll(): Promise<CategorieEntity[]> {
    return this.categorieRepo.getAll();
  }

  @Post('/seed')
  seed(@Body() Seedpassword): any {
    return this.categorieRepo.seed(Seedpassword);
  }
}
