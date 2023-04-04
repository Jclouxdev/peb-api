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

  async getAll(): Promise<CategorieEntity[]> {
    return await this.categorieRepo.find();
  }

  async seed(seedPassword): Promise<Partial<CategorieEntity[]>> {
    const data = [];
    if (seedPassword.password !== process.env.SEEDPASS) {
      throw new UnauthorizedException('invalid password');
    }

    // Restaurants
    if (!(await this.categorieRepo.findOneBy({ name: 'Restaurants' }))) {
      const restaurant = new CategorieEntity();
      restaurant.id = 1;
      restaurant.name = 'Restaurants';
      await this.categorieRepo.save(restaurant);
      data.push(restaurant);
    }

    // Boutiques
    if (!(await this.categorieRepo.findOneBy({ name: 'Boutiques' }))) {
      const boutique = new CategorieEntity();
      boutique.id = 2;
      boutique.name = 'Boutiques';
      await this.categorieRepo.save(boutique);
      data.push(boutique);
    }

    // Santé
    if (!(await this.categorieRepo.findOneBy({ name: 'Santé' }))) {
      const sante = new CategorieEntity();
      sante.id = 3;
      sante.name = 'Santé';
      await this.categorieRepo.save(sante);
      data.push(sante);
    }

    // Sport
    if (!(await this.categorieRepo.findOneBy({ name: 'Sport' }))) {
      const sport = new CategorieEntity();
      sport.id = 4;
      sport.name = 'Sport';
      await this.categorieRepo.save(sport);
      data.push(sport);
    }

    // Espaces verts
    if (!(await this.categorieRepo.findOneBy({ name: 'Espaces vert' }))) {
      const greens = new CategorieEntity();
      greens.id = 5;
      greens.name = 'Espaces vert';
      await this.categorieRepo.save(greens);
      data.push(greens);
    }

    // Tourisme
    if (!(await this.categorieRepo.findOneBy({ name: 'Tourisme' }))) {
      const tourisme = new CategorieEntity();
      tourisme.id = 6;
      tourisme.name = 'Tourisme';
      await this.categorieRepo.save(tourisme);
      data.push(tourisme);
    }

    // Logements
    if (!(await this.categorieRepo.findOneBy({ name: 'Logements' }))) {
      const logements = new CategorieEntity();
      logements.id = 7;
      logements.name = 'Logements';
      await this.categorieRepo.save(logements);
      data.push(logements);
    }

    // Autres
    if (!(await this.categorieRepo.findOneBy({ name: 'Autres' }))) {
      const autres = new CategorieEntity();
      autres.id = 8;
      autres.name = 'Autres';
      await this.categorieRepo.save(autres);
      data.push(autres);
    }

    return data;
  }
}
