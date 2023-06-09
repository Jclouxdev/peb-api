import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarkerEntity } from './marker.entity';
import { Repository } from 'typeorm';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UserEntity } from 'src/users/user.entity';
import { CategorieEntity } from 'src/categories/categorie.entity';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { ShareMarkerDto } from './dto/share-marker-dto';

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(MarkerEntity)
    private readonly markerRepo: Repository<MarkerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(CategorieEntity)
    private readonly categoryRepo: Repository<CategorieEntity>,
  ) {}

  async createMarkerWithUserId(
    createMarker: CreateMarkerDto,
    userId: number,
  ): Promise<MarkerEntity> {
    const markerEntity = MarkerEntity.create();
    const { name, lat, lon, description, categorieId } = createMarker;

    // Check if the place is already pinned
    const markerInDb = await this.markerRepo.findOneBy({
      lat: parseFloat(lat.toFixed(2)),
      lon: parseFloat(lon.toFixed(2)),
    });
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
    if (
      createMarker.categorieId == null ||
      createMarker.categorieId == undefined
    ) {
      throw new HttpException(
        'CategoryId cant be null',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const fetchCategory = await this.categoryRepo.findOneBy({
      id: categorieId,
    });
    markerEntity.categorie = fetchCategory;

    // get user with payload id
    const fetchUser = await this.userRepo.findOneBy({ id: userId });
    markerEntity.users = [fetchUser];

    // save and return
    await this.markerRepo.save(markerEntity);
    return markerEntity;
  }

  async getMyMarkers(id: number): Promise<MarkerEntity[]> {
    return await this.markerRepo.find({
      relations: {
        users: true,
        categorie: true,
      },
      where: {
        users: {
          id: id,
        },
      },
    });
  }

  async getById(id: string, userId?: number): Promise<Partial<MarkerEntity>> {
    const fetched = await this.markerRepo.findOne({
      where: { id: id, users: { id: userId } },
      // relations: { users: true },
    });
    if (!fetched) {
      throw new NotFoundException(
        `no marker found matching id : ${id} for the current user`,
      );
    }
    return fetched;
  }

  async deleteMarkerById(id: string, userId: number): Promise<any> {
    const fetched = await this.markerRepo.findOne({
      relations: { users: true },
      // where: { id: id, users: { id: userId } }
      where: { id: id },
    });
    if (!fetched) {
      throw new NotFoundException(
        `no marker found matching id : ${id} for the current user`,
      );
    }
    if (fetched.users.length > 1) {
      // Retirer l'utilisateur du tableau d'user du Marker
      fetched.users = fetched.users.filter((user) => {
        return user.id !== userId;
      });
      await this.markerRepo.save(fetched);
      return fetched;
    } else {
      await this.markerRepo.delete(id);
      return HttpCode(200);
    }
  }

  async patchById(
    id: string,
    markerUpdateDto: UpdateMarkerDto,
    userId?: number,
  ): Promise<Partial<MarkerEntity>> {
    const fetched = await this.markerRepo.findOne({
      where: { id: id, users: { id: userId } },
      // relations: { users: true },
    });
    if (!fetched) {
      throw new NotFoundException(
        `no marker found matching id : ${id} for the current user`,
      );
    }

    const markerEntity = MarkerEntity.create();
    markerEntity.name = markerUpdateDto.name;
    markerEntity.description = markerUpdateDto.description;

    await MarkerEntity.update(id, markerEntity);
    return await this.getById(id);
  }

  async shareMarkerToUsername(
    markerId: string,
    shareMarkerDto: ShareMarkerDto,
    userId: number,
  ): Promise<MarkerEntity> {
    const markerFetched = await this.markerRepo.findOne({
      where: { id: markerId, users: { id: userId } },
      relations: { users: true },
    });
    if (!markerFetched) {
      throw new NotFoundException(
        `no marker found matching id : ${markerId} for the current user`,
      );
    }

    const destUser = await this.userRepo.findOne({
      where: { username: shareMarkerDto.username },
    });
    if (!destUser) {
      throw new NotFoundException(`no user found with this username`);
    }
    if (destUser.id == userId) {
      throw new UnauthorizedException(
        `you can't share a marker with your own account`,
      );
    }

    // Add user and already existing users
    markerFetched.users = [destUser, ...markerFetched.users];
    await this.markerRepo.save(markerFetched);

    return markerFetched;
  }

  // async seed(seedPassword): Promise<Partial<MarkerEntity[]>> {
  //   const data = [];
  //   if (seedPassword.password !== process.env.SEEDPASS) {
  //     throw new UnauthorizedException('invalid password');
  //   }

  //   // First marker
  //   if (!(await this.markerRepo.findOneBy({ name: 'Restaurants' }))) {
  //     const restaurant = new CategorieEntity();
  //     restaurant.id = 1;
  //     restaurant.name = 'Restaurants';
  //     await this.markerRepo.save(restaurant);
  //     data.push(restaurant);
  //   }
  //   return data;
  // }

  // isOwned(userId: number, marker: MarkerEntity): boolean {
  //   let state = false;
  //   marker.users.forEach((element) => {
  //     if (element.id == userId) {
  //       state = true;
  //     }
  //   });
  //   return state;
  // }
}
