import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarkerEntity } from './marker.entity';
import { Repository } from 'typeorm';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UserEntity } from 'src/users/user.entity';
import { CategorieEntity } from 'src/categories/categorie.entity';

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(MarkerEntity)
    private readonly markerRepo: Repository<MarkerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserEntity)
    private readonly categoryRepo: Repository<CategorieEntity>,
  ) {}

  async createMarkerWithUserId(
    createMarker: CreateMarkerDto,
    id: number,
  ): Promise<MarkerEntity> {
    const markerEntity = MarkerEntity.create();
    const { name, lat, lon, description, categorieId } = createMarker;

    // Check if the place is already pinned
    const markerInDb = await this.markerRepo.findOneBy({
      lat: parseFloat(lat.toFixed(2)),
      lon: parseFloat(lon.toFixed(2)),
    });
    console.log(markerInDb);
    if (markerInDb) {
      throw new HttpException(
        'Marker already exist with the same exact coords',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    markerEntity.name = name;
    markerEntity.lat = lat;
    markerEntity.lon = lon;
    markerEntity.description = description;

    // get categories
    const fetchCategory = await this.categoryRepo.findOneBy({
      id: categorieId,
    });
    markerEntity.categorie = fetchCategory;

    // get user with payload id
    const fetchUser = await this.userRepo.findOneBy({ id: id });
    markerEntity.users = [fetchUser];

    // save and return
    await this.markerRepo.save(markerEntity);
    return markerEntity;
  }

  async getMyMarkers(id: number): Promise<MarkerEntity[]> {
    return await this.markerRepo.find({
      relations: {
        users: true,
      },
      where: {
        users: {
          id: id,
        },
      },
    });
  }
}
