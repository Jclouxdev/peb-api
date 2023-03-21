import { Body, Controller, Post } from '@nestjs/common';
import { CategorieService } from './categories.service';

@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieRepo: CategorieService) {}

  @Post('/seed')
  seed(@Body() Seedpassword): any {
    return this.categorieRepo.seed(Seedpassword);
  }
}
