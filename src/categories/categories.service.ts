import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorieEntity } from './categorie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(CategorieEntity)
    private readonly categorieRepo: Repository<CategorieEntity>,
  ) {}

  async seed(seedPassword): Promise<Partial<CategorieEntity[]>> {
    const data = [];
    if (seedPassword.password !== process.env.SEEDPASS) {
      throw new UnauthorizedException('invalid password');
    }

    if (!(await this.categorieRepo.findOneBy({ name: 'Restaurant' }))) {
      const restaurant = new CategorieEntity();
      restaurant.name = 'Restaurant';
      await this.categorieRepo.save(restaurant);
      data.push(restaurant);
    }

    if (!(await this.categorieRepo.findOneBy({ name: 'Boutique' }))) {
      const boutique = new CategorieEntity();
      boutique.name = 'Boutique';
      await this.categorieRepo.save(boutique);
      data.push(boutique);
    }

    return data;
  }
}
